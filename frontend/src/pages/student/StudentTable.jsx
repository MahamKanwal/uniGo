import React from "react";
import { Image, Space, Tag, Button, Table } from "antd";
import { toast } from "react-toastify";
import { useDeleteStudentMutation } from "../../features/student/studentApi";
import { useNavigate } from "react-router-dom";


const StudentTable = ({ students }) => {
  const navigate = useNavigate();
  const [deleteStudent] = useDeleteStudentMutation();
   
  const handleDelete = (id) => {
  deleteStudent(id);
  toast.success("Student deleted successfully!");
  };

const studentColumns = [
  {title: "S.No",key: "sno",render: (_, __, index) => index + 1,},
 
  {title: "Image",dataIndex: "student_image",key: "student_image",render: (img) => (
  <Image src={img} width={40} height={40}
    style={{ borderRadius: "50%" }}/>),},
 
  {title: "Roll No",dataIndex: "rollNo",key: "rollNo",},
  {title: "Name",dataIndex: "name",key: "name",},
  {title: "Email", dataIndex: "email", key: "email",},
  {title: "CNIC", dataIndex: "cnic", key: "cnic",},
  {title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber",},
 
  {title: "Gender", dataIndex: "gender", key: "gender", render: (gender) => (
  <Tag color={gender === "Male" ? "blue" : "pink"}>
  {gender.toUpperCase()}</Tag>),},

  {title: "City", dataIndex: "city", key: "city",},
  {title: "Action", key: "action", render: (_, record) => (
       <Space>
        <Button type="link">View</Button>
        <Button type="link" onClick={() => navigate(`/students/edit/${record._id}`)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      </Space>
    ),
  },
];

  return (
    <div className="max-w-7xl mx-auto">
      <Table columns={studentColumns} dataSource={students.users}  rowKey="_id"/>
    </div>
  );
};

export default StudentTable;


