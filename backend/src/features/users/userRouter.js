import {
  deleteUserById,
  getAllUsers,
  getUserById,
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

export default userRouter;

