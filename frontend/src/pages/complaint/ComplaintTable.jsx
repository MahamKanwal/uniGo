import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import DataView from "../DataView";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useDeleteComplaintMutation } from "../../features/complaint/complaintApi";
import { toast } from "react-toastify";

const ComplaintTable = ({ complaints }) => {
  const [selectedComp, setSelectedComp] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const navigate = useNavigate();
  const [deleteComplaint] = useDeleteComplaintMutation();

  const handleDelete = async () => {
      await deleteComplaint(deleteModalOpen).unwrap();
      toast.success("Complaint deleted successfully!");
      setDeleteModalOpen(null);
  };

  const compColumns = [
    { title: "S.No", key: "sno", render: (_, __, index) => index + 1 },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "in-progress"
              ? "blue"
              : "green"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
      {
      title: "Complaint By",
      dataIndex: "complainerName",
      key: "complainerName",
    },
     {
      title: "Complainer Role",
      dataIndex: "complainerRole",
      key: "complainerRole",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedName",
      key: "assignedTo",
    },
     {
      title: "Assigned Role",
      dataIndex: "assignedRole",
      key: "assignedRole",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedComp(record)}>View</Button>
          <Button type="link" onClick={() => navigate(`/complaints/edit/${record._id}`)}>Edit</Button>
          <Button type="link" danger onClick={() => setDeleteModalOpen(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  // console.log("Complaints data:", complaints?.complaints);
  return (
    <div>
      <Table
        columns={compColumns}
        dataSource={complaints?.complaints}
        rowKey="_id"
      />
      <DataView
        data={selectedComp}
        visible={!!selectedComp}
        onClose={() => setSelectedComp(null)}
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

export default ComplaintTable;
