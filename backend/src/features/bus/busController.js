import Bus from "./busModel.js";
import { checkRequiredFields } from "../../utils/helperFunctions.js";

export const createBus = async (req, res, next) => {
  try {
    const data = req.body;
    const requiredFields = ["busNumber", "status", "driverId"];
    checkRequiredFields(data, requiredFields);

    const newBus = await Bus.create(data);
    res.status(201).json({ message: "Bus created successfully", bus: newBus });
  } catch (error) {
    next(error);
  }
};

export const getAllBuses = async (req, res, next) => {
  try {
    // Populate driverId with selected fields
    const buses = await Bus.find().populate("driverId", "name email phoneNumber licence");

    // Optional: Clean response to combine bus & driver info
    const result = buses.map((bus) => ({
      _id: bus._id,
      busNumber: bus.busNumber,
      status: bus.status,
      // Driver info embedded
      driver: bus.driverId
        ? {
            _id: bus.driverId._id,
            name: bus.driverId.name,
            email: bus.driverId.email,
            phoneNumber: bus.driverId.phoneNumber,
            licence: bus.driverId.licence,
          }
        : null,
      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    }));

    res.status(200).json({ buses: result });
  } catch (error) {
    next(error);
  }
};


export const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("driverId");
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ bus });
  } catch (error) {
    next(error);
  }
};

export const updateBus = async (req, res, next) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    next(error);
  }
};
