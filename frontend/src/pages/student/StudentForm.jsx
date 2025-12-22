import React from "react";
import { FaUser, FaIdCard, FaCity, FaUserTie } from "react-icons/fa";
import { MdEmail, MdDateRange, MdLocationOn, MdWc } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormGenerator from "../../components/formElements/FormGenerator";
import Drawer from "../../components/ui/Drawer";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/user/userApi";

const StudentForm = () => {
  const { id } = useParams();
  const { data } = useGetUserByIdQuery(id, { skip: !id });
  const [updateUser] = useUpdateUserMutation();

  const handleSubmit = async (student) => {
    await updateUser({ id, ...student }).unwrap();
    toast.success("Student updated successfully!");
  };

  const studentFormFields = [
    {
      name: "name",
      icon: <FaUser className="text-blue-500" />,
      required: true,
      min: 3,
    },
    {
      name: "email",
      icon: <MdEmail className="text-green-500" />,
      type: "email",
      required: true,
      pattern: /^\S+@\S+\.\S+$/,
    },
    {
      name: "rollNo",
      icon: <FaIdCard className="text-purple-500" />,
      required: true,
    },
    {
      name: "cnic",
      icon: <FaIdCard className="text-red-500" />,
      required: true,
    },
    {
      name: "phoneNumber",
      icon: <IoMdCall className="text-green-500" />,
      required: true,
      min: 11,
    },
    {
      name: "guardianContact",
      icon: <FaUserTie className="text-yellow-500" />,
      required: true,
      min: 11,
    },
    {
      name: "gender",
      icon: <MdWc className="text-pink-500" />,
      type: "select",
      options: ["male", "female"],
      required: true,
    },
    {
      name: "address",
      icon: <MdLocationOn className="text-orange-500" />,
      type: "textarea",
    },
    {
      name: "city",
      icon: <FaCity className="text-teal-500" />,
      type: "select",
      options: ["Karachi", "Lahore", "Islamabad", "Quetta", "Peshawar"],
    },
    { name: "student_image", type: "image" },
  ];

  return (
    <Drawer title={`${id ? "Update" : ""} Student`}>
      <FormGenerator
      key={id}
        fields={studentFormFields}
        onSubmit={handleSubmit}
        defaultValues={data?.user}
      />
    </Drawer>
  );
};

export default StudentForm;
