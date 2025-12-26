import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "./complaintController.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
