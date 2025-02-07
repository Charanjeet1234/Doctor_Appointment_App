import validator from "validator";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
// Api for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log({
      imageFile,
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    });

    // Checking for all data to add doctor

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    )
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    // validate strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // hasing doctor password
    const salt = await bcrypt.genSalt(10); //Number of rounds to encrypt the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to the cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    // save doctor to the database
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for the admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for getting all doctors

const allDoctors = async (req, res) => {
  try {
    const doctor = await doctorModel.find({}).select("-password"); // .select('-password ) will remove the password property from the doctor response
    res.json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Api to get all appointments list
const appointmentsAdmin = async (req,res) =>
{
  try{
 const appointments = await appointmentModel.find({})
 res.json({ success: true, appointments });
  }catch(error)
  {
  console.error(error);
  res.status(500).json({ success: false, message: error.message });
  }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) =>
  {
    try
    {
    const {appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
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

  // API to get dashboard data for admin pannel

  const adminDashboard = async (req, res) =>
  {
        try
        {
             const doctors = await doctorModel.find({})
             const users = await userModel.find({})
             const appointments = await appointmentModel.find({})

             const dashData = {
              doctors: doctors.length,
              appointments: appointments.length,
              patients: users.length,
              latestAppointments: appointments.reverse().slice(0,5)
             }
             res.json({ success: true, dashData });
        }catch(error)
        {
          console.error(error);
          res.status(500).json({ success: false, message: error.message });
        }
  }
export { addDoctor, loginAdmin, allDoctors , appointmentsAdmin, appointmentCancel,adminDashboard};
