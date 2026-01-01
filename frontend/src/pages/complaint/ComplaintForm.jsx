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
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  // Set role and form values from data when editing
  useEffect(() => {
    if (complaintData?.complaint) {
      const { assignedRole, title, description, status, assignedId } = complaintData.complaint;
      // console.log(complaintData?.complaint);
      console.log("Assigned Role:", assignedRole);
      setRole(assignedRole);
      setFormValues({
        title: title || "",
        description: description || "",
        status: status || "pending",
        role: assignedRole || "driver",
        assignedTo: assignedId || "",
      });
    } else {
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        role: "driver",
        assignedTo: "",
      });
    }
  }, [complaintData]);

  // Fetch users based on role
  const { data: usersData } = useGetUserListQuery({ role });

  // Handle form submission
  const handleSubmit = async (complaint) => {
    console.log("Submitting complaint:", complaint);
    try {
      if (id) {
        await updateComplaint({ id, ...complaint }).unwrap();
        toast.success("Complaint updated successfully!");
      } else {
        await addComplaint(complaint).unwrap();
        toast.success("Complaint created successfully!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    // Update form values
    setFormValues(prev => ({
      ...prev,
      role: newRole,
      assignedTo: "" // Reset assignedTo when role changes
    }));
  };

  // Update form fields whenever role or usersData changes
  useEffect(() => {
    // Map usersData to options for select
  //   const assignedToOptions = usersData?.users?.map(user => ({
  //     name: user.name,
  //     value: user.id,
  //     label: user.name
  //   })) || [];
  //  console.log(usersData?.users);
    const statusOptions = ["pending", "in-progress", "resolved"].map(option => ({
      name: option,
      value: option,
      label: option.charAt(0).toUpperCase() + option.slice(1)
    }));

    const roleOptions = ["admin", "student", "driver"].map(option => ({
      name: option,
      value: option,
      label: option.charAt(0).toUpperCase() + option.slice(1)
    }));

    const fields = [
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
        options: statusOptions,
        required: true,
      },
      {
        name: "role",
        icon: <MdAssignmentInd className="text-orange-500" />,
        type: "select",
        options: roleOptions,
        required: true,
        onChange: handleRoleChange,
      },
      {
        name: "assignedTo",
        label: `Select ${role}`,
        icon: <MdInfo className="text-purple-500" />,
        type: "select",
        options: usersData?.users,
        placeholder: `Select ${role}`,
        required: true,
      },
    ];

    setFormFields(fields);
  }, [role, usersData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Drawer title={`${id ? "Update" : "Add"} Complaint`}>
      <FormGenerator
        key={`form-${role}`} // Key changes when role changes, forcing re-render
        fields={formFields}
        onSubmit={handleSubmit}
        defaultValues={formValues}
      />
    </Drawer>
  );
};

export default ComplaintForm;
