import Complaint from "./complaintModel.js";
import User from "../users/userModel.js";

/* ===============================
   CREATE COMPLAINT
================================ */
export const createComplaint = async (req, res, next) => {
  try {
    const { title , description, status, assignedTo } = req.body;
console.log(req.body);

    if (!title || !description || !status || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate assigned user
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: "Assigned user not found" });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,  
      title,
      description,
      status,
      assignedTo,
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   GET ALL COMPLAINTS
================================ */
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name role")
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 });

    const formattedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
      createdAt: complaint.createdAt,
   complainerName: complaint.userId.name,
   complainerRole:complaint.userId.role,
  assignedName: complaint.assignedTo.name,
   assignedRole:complaint.assignedTo.role,
    }));

    res.status(200).json({
      success: true,
      complaints: formattedComplaints,
    });
  } catch (error) {
    next(error);
  }
};


/* ===============================
   GET COMPLAINT BY ID
================================ */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name role")
      .populate("assignedTo", "name role _id");
      
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

 const formattedComplaint ={
      _id: complaint._id,
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
      createdAt: complaint.createdAt,
   complainerName: complaint.userId.name,
   complainerRole:complaint.userId.role,
  assignedName: complaint.assignedTo.name,
   assignedRole:complaint.assignedTo.role,
   assignedId:complaint.assignedTo._id,

    };

    res.status(200).json({
      success: true,
      complaint: formattedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   UPDATE COMPLAINT
================================ */
export const updateComplaint = async (req, res, next) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    // Allowed updates only
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (status) updates.status = status;
    if (assignedTo) updates.assignedTo = assignedTo;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("userId", "name role")
      .populate("assignedTo", "name role");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   DELETE COMPLAINT
================================ */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
