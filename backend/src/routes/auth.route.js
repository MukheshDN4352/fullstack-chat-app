import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { Buffer as SafeBuffer } from 'safe-buffer';
import { Buffer as NodeBuffer } from 'buffer';

const Buffer2 = SafeBuffer || NodeBuffer;


const router=express.Router();



router.post("/signup", signup);

router.post("/login", login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth)


export default router;