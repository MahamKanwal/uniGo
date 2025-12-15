import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female", "other"],
      default: "male",
    },
    rollNo: { type: String, unique: true, sparse: true, trim: true },
    cnic: { type: String, unique: true, sparse: true ,trim: true},
    phoneNumber: { type: String, unique: true, trim: true, sparse: true },
    guardianContact: { type: String, unique: true, trim: true, sparse: true },
    address: { type: String },
    cnicImage: { type: Object },
    idImage: { type: Object },
    role: {
      type: String,
      enum: ["student", "admin", "driver"],
      required: true,
    },
    licence: { type: String, unique: true, sparse: true },
    policeClearance: { type: String, enum: ["verified", "not verified"] },
    age: { type: Number },
  },
  { timestamps: true }
);
const userModal = mongoose.model("User", userSchema);

export default userModal;
