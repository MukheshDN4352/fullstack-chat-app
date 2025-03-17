import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import {io, Socket} from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:5000":"/";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
     onlineUsers:[],
     socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();   
        } catch (error) {
            console.log(error.message);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signUp: async(data)=>{
        set({isSigningUp:true});
        try {
          const res=  await axiosInstance.post("/auth/signup",data);
          set({authUser:res.data});
          toast.success("Account has been sucessfully created")  ;
          get().connectSocket();         
        } catch (error) {
            toast.error(error.message);     
        }finally{
            set({isSigningUp:false});
        }

    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in sucessfully");   
            get().connectScoket();    
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }

    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out succesfully") ;
            const { disConnectSocket } = useAuthStore.getState();
            disConnectSocket();
           
        } catch (error) {
            toast.error(error.message)
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res=await axiosInstance.put("auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile has been succesfully")
            
        } catch (error) {
            toast.error(error.response.data.message)
            
        }finally{
            set({isUpdatingProfile:false});
        }

    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disConnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect(); 
            set({ socket: null });
        }
    }
}))