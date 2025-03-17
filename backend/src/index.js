import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDB } from "./lib/db.js";
import { Buffer as SafeBuffer } from 'safe-buffer';
import { Buffer as NodeBuffer } from 'buffer';
import path from "path"

const Buffer2 = SafeBuffer || NodeBuffer;




import messageRoutes from "./routes/message.route.js"
import { app ,server} from "./lib/socket.js";


dotenv.config();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());

const PORT=process.env.PORT;
const __dirname=path.resolve();


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.send(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


app.get("/",(req,res)=>{
    res.send("hello");
})

server.listen(PORT,()=>{
    console.log("server is running on port "+PORT)
    connectDB();
});