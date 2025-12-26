import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "resolved"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
