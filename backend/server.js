import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";

// app config

const app = express();
// define port
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()
// middlewares 
app.use(express.json());
// it allows to connect frontend to backend server
app.use(cors()); 

// api endpoints
app.use('/api/admin', adminRouter)
// localhost:4000/api/admin/add-doctor

app.get("/", (req, res) => {
    res.send("Hello from the server ! API is working");
})

// Run the server / application
app.listen(port, ()=> console.log(`Server Listening on http://localhost:${port}`));