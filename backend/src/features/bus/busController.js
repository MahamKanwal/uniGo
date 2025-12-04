import { checkRequiredFields } from "../../utils/helperFunctions.js";
import busModel from "./busModel.js";

export const createBus = (req, res, next) => {
    try {
        const data = req.body;
        const requiredFields = ["busNumber", "status", "driverId"];
        checkRequiredFields(data, requiredFields);
        res.status(201).json({message:"Bus created successfully"});
    } catch (error) {
        next(error);
    }
}