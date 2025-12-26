import React, { useState, useEffect } from "react";
import {
  useAddComplaintMutation,
  useGetComplaintByIdQuery,
  useUpdateComplaintMutation,
} from "../../features/complaint/complaintApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdTitle, MdDescription, MdAssignmentInd, MdInfo } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import Drawer from "../../components/ui/Drawer";
import FormGenerator from "../../components/formElements/FormGenerator";
import { useGetUserListQuery } from "../../features/user/userApi";

const ComplaintForm = () => {
  const { id } = useParams();
  const { data: complaintData, isLoading } = useGetComplaintByIdQuery(id, { skip: !id });

  const [updateComplaint] = useUpdateComplaintMutation();
  const [addComplaint] = useAddComplaintMutation();
  const [role, setRole] = useState("driver");
  
  // Set role from data when editing
  useEffect(() => {
    if (complaintData?.complaint?.role) {
      setRole(complaintData.complaint.role);
    }
  }, [complaintData]);

  // Fetch users based on role
  const { data: usersData } = useGetUserListQuery({ role });

  // Map usersData to options for select
  const assignedToOptions = usersData?.users?.map(user => ({
    name: user.name,  // Changed from 'label' to 'name'
    value: user.id
  })) || [];

  // Default form values
  const defaultValues = {
    title: complaintData?.complaint?.title || "",
    description: complaintData?.complaint?.description || "",
    status: complaintData?.complaint?.status || "pending",
    role: complaintData?.complaint?.role || "driver",
    assignedTo: complaintData?.complaint?.assignedTo || "",
  };

  // Handle form submission
  const handleSubmit = async (complaint) => {
    try {
      if (id) {
        await updateComplaint({ id, ...complaint }).unwrap();
        toast.success("Complaint updated successfully!");
      } else {
        await addComplaint(complaint).unwrap();
        toast.success("Complaint created successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  // Form fields (computed on every render so role updates label dynamically)
  const complaintFormFields = [
    {
      name: "title",
      icon: <MdTitle className="text-blue-500" />,
      required: true,
    },
    {
      name: "description",
      icon: <MdDescription className="text-green-500" />,
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      icon: <FaTasks className="text-purple-500" />,
      type: "select",
      options: ["pending", "in-progress", "resolved"].map(option => ({
        name: option,
        value: option
      })),
      required: true,
    },
    {
      name: "role",
      icon: <MdAssignmentInd className="text-orange-500" />,
      type: "select",
      options: ["admin", "student", "driver"].map(option => ({
        name: option,
        value: option
      })),
      required: true,
      onChange: (e) => setRole(e.target.value),
    },
    {
      name: "assignedTo",
      label: `Select ${role}`,
      icon: <MdInfo className="text-purple-500" />,
      type: "select",
      options: assignedToOptions,
      placeholder: `Select ${role}`,
      required: true,
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Drawer title={`${id ? "Update" : "Add"} Complaint`}>
      <FormGenerator
        key={`${id}-${role}`}
        fields={complaintFormFields}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </Drawer>
  );
};

export default ComplaintForm;