import express from "express";
import { createBus } from "./busController.js";
const busRouter = express.Router();
busRouter.post("/create", createBus);

export default busRouter;