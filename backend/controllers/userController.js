import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe"
// import razor from "razor


// API to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //   validating strong email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter valid email" });
    }
    //   validating strong password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    // save data in the database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    //    create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// API for user Login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Api to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user Profile API
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    // check if doctor is available
    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }
    let slots_booked = docData.slots_booked;
    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user Appointment
const listAppointment = async (req, res) =>
{
  try
  {
  const {userId} = req.body;
  const appointments = await appointmentModel.find({userId});
  res.json({ success: true, appointments });

  }catch(error)
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to cancel appointment

const cancelAppointment = async (req, res) =>
{
  try
  {
  const {userId, appointmentId} = req.body;
  const appointmentData = await appointmentModel.findById(appointmentId);

  // verify appointment user
  if(appointmentData.userId !== userId )
  {
    return res.status(401).json({ success: false, message: "Unauthorized action" });
  } 
  await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

// releasing doctor slot
  const {docId, slotDate, slotTime} = appointmentData
  const doctorData = await doctorModel.findById(docId);
  let slots_booked = doctorData.slots_booked
  slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime )
  await doctorModel.findByIdAndUpdate(docId,{slots_booked})
  res.json({ success: true, message: "Appointment cancelled successfully" });

  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// const stripepayInstance = new ({
// key_id: process.env.STRIPE_KEY_ID,
// key_secret:process.env.STRIPE_SECRET_KEY,

// })
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// APi to male payment of appointment using stripe pay
const paymentStripePay = async (req,res) =>
{
  try
  {
    const {appointmentId} = req.body
 const appointmentData = await appointmentModel.findById(appointmentId)
 if(!appointmentData || appointmentData.cancelled)
 {
  return res.json({ success: false, message: "Appointment not found or cancelled" });
 }

 // creating options for Razor pay
//  const options = {
//   amount:appointmentData.amount * 100,
//   currency: process.env.CURRENCY,
//   receipt: appointmentId, 
//  }

//  creation of an order
// const order = await stripe.paymentIntents.create(options)
// res.json({ success: true, order, clientSecret: order.client_secret })

const order = await stripe.paymentIntents.create({
  amount:appointmentData.amount * 100,
  currency: process.env.CURRENCY,
  metadata: {appointmentId}, 
})
 res.json({ success: true, order, clientSecret: order.client_secret })
     
  }catch(err)
  {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// API for stripe scheckout
const stripeCheckout = async (req,res) =>
{
  try{
     const { order } = req.body
     // Debug: Check if order exists and has the required properties
    console.log("Received Order:", order);

    if (!order || !order.amount || !order.currency) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

     const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: order.currency,
            product_data: {
              name: "Appointment Payment",
              description: "Payment for appointment",
            },
            unit_amount: order.amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `${process.env.CLIENT_URL}/success`,
      // cancel_url: `${process.env.CLIENT_URL}/cancel`,
      success_url: `${process.env.CLIENT_URL}my-appointments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}my-appointments`,
    });

    res.json({ success: true, sessionId: session.id, order });
  }catch(error)
  {
    console.error("Stripe Checkout error",error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to verify payment of stripe and razor pay

const verifyStripepay = async (req, res) =>
{
try{
  // const {razorpay_order_id} = req.body  ---- for razor pay

  // for stripe pay
  const { sessionId } = req.body
  console.log("SessionId", sessionId)

  if(!sessionId)
  {
    return res.status(400).json({ success: false, message: "Invalid session id" });
  }
// Retrieve session details from Stripe
const session = await stripe.checkout.sessions.retrieve(sessionId);
console.log("Payment Session", session)
if(session.status === "paid")
{
  await appointmentModel.findByIdAndUpdate(session.sessionId, {payment:true})
  res.json({ success: true, message: "Payment successful" });
}
else
{
  res.json({ success: false, message: "Payment failed" });
}

res.json({
  success: true,
  payment_id: session.payment_intent,
  status: session.payment_status,
});
} catch (error) {
console.error("❌ Error retrieving payment details:", error);
res.status(500).json({ success: false, message: error.message });
}
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment,listAppointment, cancelAppointment,paymentStripePay,stripeCheckout,verifyStripepay };
