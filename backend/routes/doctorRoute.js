import { doctorList } from "../controllers/doctorController.js";

// create api endpoint for doctors
import express from "express";
const doctorRouter = express.Router();

// endpoint for docotor list
doctorRouter.get("/list", doctorList);

export default doctorRouter;
