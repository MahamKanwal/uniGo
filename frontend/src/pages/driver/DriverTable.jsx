import React, { useState } from "react";
import { Space, Tag, Button, Table } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation } from "../../features/user/userApi";
import DataView from "../DataView";
import ConfirmModal from "../../components/ui/ConfirmModal";

const DriverTable = ({ drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const navigate = useNavigate();

  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = () => {
    deleteUser(deleteModalOpen);
    toast.success("Driver deleted successfully!");
    setDeleteModalOpen(null);
  };

  const driverColumns = [
    { title: "S.No", key: "sno", render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Licence Number", dataIndex: "licence", key: "licence" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "CNIC", dataIndex: "cnic", key: "cnic" },
    { title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Police Clearance",
      dataIndex: "policeClearance",
      key: "policeClearance",
      render: (policeClearance) => (
        <Tag color={policeClearance === "verified" ? "blue" : "red"}>
          {policeClearance.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === "male" ? "blue" : "pink"}>
          {gender.toUpperCase()}
        </Tag>
      ),
    },

    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedDriver(record)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/drivers/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => setDeleteModalOpen(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Table columns={driverColumns} dataSource={drivers.users} rowKey="_id" />

      <DataView
        data={selectedDriver}
        visible={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(null)}
        onConfirm={handleDelete}
        title="Delete"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default DriverTable;
