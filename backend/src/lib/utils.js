
import { Buffer } from 'buffer';
global.Buffer = Buffer; // Ensure Buffer is globally available

import jwt from 'jsonwebtoken';  // Ensure this comes after the Buffer import

export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,// ms
        HttpOnly:true,// prevent xss attacks cross-site scripting attacks
        sameSite:"strict", // csrf attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !== "development"
    });
    return token;
}