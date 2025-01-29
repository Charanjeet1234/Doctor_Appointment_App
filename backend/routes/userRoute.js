import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

// create instance of the user

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

export default userRouter;