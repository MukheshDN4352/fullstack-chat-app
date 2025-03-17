import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import {io,getReceiverSocketId} from"../lib/socket.js";

export const getUsersForSidebar=async (req,res)=>{
    try {
        const loggedInUserID=req.user._id;
        const filteredUsers =await User.find({_id:{$ne:loggedInUserID}}).select("-password");
        res.status(200).json(filteredUsers);

        
    } catch (error) {
        console.log("error in getUserForSidebar controller ",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

export const getMessages =async (req,res)=>{
    try {
        const {id:userTochatID}=req.params;
        const myID =req.user._id;
        const messages= await Message.find({
            $or:[
                {senderID:myID, recieverID:userTochatID},
                {senderID:userTochatID,recieverID:myID}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller ",error.message);
        res.status(500).json({message:"internal server error"});
        
    }
}

export const sendMessage =async(req,res)=>{
    try {
        const {text ,image}=req.body;
        const {id:recieverID}=req.params;
        const senderID =req.user._id;
        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
        const uploadResponse =await cloudinary.uploader.upload(image);
        imageUrl =uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderID,
            recieverID,
            text,
            image:imageUrl
        });
        await newMessage.save();

        //todo : realtime functionality goes here => socket.io
        const recieverScocketId=getReceiverSocketId(recieverID);
        if(recieverScocketId) {
            io.to(recieverScocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);

        
    } catch (error) {
        console.log("error in send message  controller ",error.message);
        res.status(500).json({message:"internal server error"});
    }
}