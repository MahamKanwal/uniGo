import mongoose from "mongoose";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import {
  checkRequiredFields,
  generateToken,
} from "../../utils/helperFunctions.js";

/* =========================
   REGISTER USER
========================= */
export const registerUser = async (req, res, next) => {
  try {
    const data = req.body;

    const commonFields = ["name", "email", "password", "role"];

    const studentFields = [
      "rollNo",
      "cnic",
      "phoneNumber",
      "guardianContact",
      "address",
      "age",
      "city",
    ];

    const driverFields = [
      "policeClearance",
      "phoneNumber",
      "cnic",
      "licence",
      "address",
      "age",
      "city",
    ];

    let requiredFields = [...commonFields];
    if (data.role === "student") requiredFields.push(...studentFields);
    if (data.role === "driver") requiredFields.push(...driverFields);

    checkRequiredFields(data, requiredFields);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await userModel.create({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        ...newUser.toObject(),
        password: undefined,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(createHttpError(400, "Email and password are required"));

    const user = await userModel.findOne({ email });
    if (!user) return next(createHttpError(401, "Invalid email or password"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(createHttpError(401, "Invalid email or password"));

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "User login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        rollNo: user.rollNo,
        phoneNumber: user.phoneNumber,
        address: user.address,
        dob: user.dob,
        cnic: user.cnic,
        city: user.city,
        guardianContact: user.guardianContact,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL USERS (BY ROLE)
========================= */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, list } = req.query;

    if (!role) return next(createHttpError(400, "Role is required"));

    const users = await userModel
      .find({ role })
      .select("-password -__v")
      .lean();
    let listOfUsers;
    if (list) {
      listOfUsers = users.map((user) => ({ name: user.name, value: user._id }));
    }
    res.status(200).json({
      message: `${role} fetched successfully`,
      users: list ? listOfUsers : users,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET USER BY ID
========================= */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate if id exists and is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid or missing user ID"));
    }

    const user = await userModel
      .findById(id)
      .select("-password -__v")
      .lean();

    if (!user) return next(createHttpError(404, "User not found"));

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};


/* =========================
   UPDATE USER
========================= */
export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedUser = await userModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .select("-password -__v");

    if (!updatedUser) return next(createHttpError(404, "User not found"));

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE USER
========================= */
export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
