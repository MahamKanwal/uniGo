import Bus from "./busModel.js";
import { checkRequiredFields } from "../../utils/helperFunctions.js";

/* =========================
   CREATE BUS
========================= */
export const createBus = async (req, res, next) => {
  try {
    const data = req.body;
    const requiredFields = ["busNumber", "status", "driverId"];
    checkRequiredFields(data, requiredFields);

    const newBus = await Bus.create(data);

    res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL BUSES
   (NO driverId in response)
========================= */
export const getAllBuses = async (req, res, next) => {
  try {
    // populate only required driver field
    const buses = await Bus.find()
      .populate("driverId", "name");

    const result = buses.map((bus) => ({
      _id: bus._id,
      busNumber: bus.busNumber,
      status: bus.status,
      driverId: bus.driverId?._id || null,
      
      // only driver name (NO driverId column)
      driverName: bus.driverId?.name || null,

      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    }));

    res.status(200).json({ buses: result });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BUS BY ID
========================= */
export const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate("driverId", "name");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const response = {

      _id: bus._id,
      busNumber: bus.busNumber,
      status: bus.status,
      driverId: bus.driverId?._id || null,
      driverName: bus.driverId?.name || null,
      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    };

    res.status(200).json({ bus: response });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE BUS
========================= */
export const updateBus = async (req, res, next) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("driverId", "name");

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({
      message: "Bus updated successfully",
      bus: {
        _id: updatedBus._id,
        busNumber: updatedBus.busNumber,
        status: updatedBus.status,
        driverName: updatedBus.driverId?.name || null,
        createdAt: updatedBus.createdAt,
        updatedAt: updatedBus.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE BUS
========================= */
export const deleteBus = async (req, res, next) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    next(error);
  }
};
