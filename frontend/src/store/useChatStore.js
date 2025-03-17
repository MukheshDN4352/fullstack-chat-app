import { create } from "zustand";

import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

import { useAuthStore } from "./useAuthStore";



export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true});
        try {
            const res=await axiosInstance.get("/message/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosInstance.get(`/message/${userId}`)
            set({messages:res.data})
            
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    },
    
    setSelectedUser:(selectedUser)=>set({selectedUser}),

    sendMessage:async(messageData)=>{
        const {selectedUser ,messages}=get()
        try {
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages:()=>{
        const{selectedUser}=get();
        if(!selectedUser) return;
        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            const isMesssageSentFromSelectedUSer=newMessage.senderID ===selectedUser._id;


            if(!isMesssageSentFromSelectedUSer) return;
            set({
                messages:[...get().messages,newMessage]
            })
        });
    },

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.warn("Socket is not initialized or already disconnected.");
            return;
        }
        socket.off("newMessage");
    },

}))