import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment,listAppointment,cancelAppointment,paymentStripePay,stripeCheckout } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

// create instance of the user
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-stripe', authUser, paymentStripePay)
userRouter.post('/stripe-checkout', authUser, stripeCheckout)
// userRouter.post('/stripe-checkout', authUser, razorPayCheckout)
export default userRouter;

