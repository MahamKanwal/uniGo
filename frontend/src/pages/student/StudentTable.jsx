import React, { useState } from "react";
import { Space, Tag, Button, Table } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation } from "../../features/user/userApi";
import DataView from "../DataView";
import ConfirmModal from "../../components/ui/ConfirmModal";

const StudentTable = ({ students }) => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] =  useState(null);

   const [deleteUser] = useDeleteUserMutation();

  const handleDelete = () => {
    deleteUser(deleteModalOpen);
    toast.success("Student deleted successfully!");
    setDeleteModalOpen(null);
  };

  const studentColumns = [
    { title: "S.No", key: "sno", render: (_, __, index) => index + 1, responsive: ["sm"] },
    { title: "Roll No", dataIndex: "rollNo", key: "rollNo", responsive: ["sm"] },
    { title: "Name", dataIndex: "name", key: "name", responsive: ["xs", "sm"] },
    { title: "Email", dataIndex: "email", key: "email", responsive: ["md"] },
    { title: "CNIC", dataIndex: "cnic", key: "cnic", responsive: ["lg"] },
    { title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber", responsive: ["md"] },
    { 
      title: "Gender", 
      dataIndex: "gender", 
      key: "gender", 
      render: (gender) => (
        <Tag color={gender === "Male" ? "blue" : "pink"}>
          {gender.toUpperCase()}
        </Tag>
      ),
      responsive: ["sm"]
    },
    { title: "City", dataIndex: "city", key: "city", responsive: ["md"] },
    { 
      title: "Action", 
      key: "action", 
      render: (_, record) => (
        <Space wrap>
          <Button type="link" onClick={() => setSelectedStudent(record)}>View</Button>
          <Button type="link" onClick={() => navigate(`/students/edit/${record._id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => setDeleteModalOpen(record._id)}>Delete</Button>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg"]
    },
  ];

  return (
    <div className="max-w-7xl mx-auto overflow-x-auto">
      <Table
        columns={studentColumns}
        dataSource={students.users}
        rowKey="_id"
        scroll={{ x: "max-content" }} // Horizontal scroll on small screens
        pagination={{ pageSize: 10 }}
      />

      <DataView
        data={selectedStudent}
        visible={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

    <ConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(null)} 
       onConfirm={handleDelete} title="Delete" message="Are you sure you want to delete?" confirmText="Delete"
        cancelText="Cancel"/>
    </div>
  );
};

export default StudentTable;
