import express from "express";
import {signupUser,loginUser, logOut,followUnFollowUser,updateUser,getProfile} from "../controller/userController.js";
import protectRoute from "../middlewares/protectRoute.js";


const router = express.Router();

router.get('/profile/:userName',getProfile)
router.post('/signup',signupUser);
router.post('/login',loginUser);
router.post('/logout',logOut);
router.post('/follow/:id',protectRoute,followUnFollowUser);
router.post('/updateUser/:id',protectRoute,updateUser);


export default router;
