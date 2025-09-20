import  {fetchCurrentUser, loginUser, logoutUser, registerUser}  from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.post('/registerUser',registerUser);
router.post('/loginUser',loginUser)
router.post('/logoutUser',logoutUser)
router.get('/me',verifyJWT,fetchCurrentUser)
export default router;
