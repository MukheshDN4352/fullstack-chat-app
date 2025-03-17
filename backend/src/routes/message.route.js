import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";
import { Buffer as SafeBuffer } from 'safe-buffer';
import { Buffer as NodeBuffer } from 'buffer';

const Buffer2 = SafeBuffer || NodeBuffer;

const router= express.Router();


router.get("/users",protectRoute, getUsersForSidebar);

router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute, sendMessage)

export default router;