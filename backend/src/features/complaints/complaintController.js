import Complaint from "./complaintModel.js";

/* CREATE COMPLAINT */
export const createComplaint = async (req, res, next) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newComplaint = await Complaint.create({ userId, title, description });
    res.status(201).json({ message: "Complaint created successfully", complaint: newComplaint });
  } catch (error) {
    next(error);
  }
};

/* GET ALL COMPLAINTS */
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email") // optional
      .populate("assignedTo", "name email"); // optional

    res.status(200).json({ complaints });
  } catch (error) {
    next(error);
  }
};

/* GET COMPLAINT BY ID */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ complaint });
  } catch (error) {
    next(error);
  }
};

/* UPDATE COMPLAINT */
export const updateComplaint = async (req, res, next) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ message: "Complaint updated successfully", complaint: updatedComplaint });
  } catch (error) {
    next(error);
  }
};

/* DELETE COMPLAINT */
export const deleteComplaint = async (req, res, next) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!deletedComplaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    next(error);
  }
};
