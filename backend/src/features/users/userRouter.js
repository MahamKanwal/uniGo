import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
  loginUser,
  registerUser,
} from "./userController.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id", updateUserById);

export default userRouter;
