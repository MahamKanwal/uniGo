import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useDeleteBusMutation } from "../../features/bus/BusApi";
import DataView from "../DataView";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-toastify";

const BusTable = ({ buses }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const navigate = useNavigate();

  const [deleteBus] = useDeleteBusMutation();

  const handleDelete = () => {
    deleteBus(deleteModalOpen);
    toast.success("Bus deleted successfully!");
    setDeleteModalOpen(null);
  };

  const busColumns = [
    {
      title: "S.No",
      key: "sno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "busNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "inactive"
              ? "red"
              : "orange"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Driver",
      dataIndex: "driverName",
      key: "driver",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedBus(record)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/buses/edit/${record._id}`)}
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
    <div>
      <Table columns={busColumns} dataSource={buses.buses} rowKey="_id" />
      <DataView
        data={selectedBus}
        visible={!!selectedBus}
        onClose={() => setSelectedBus(null)}
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

export default BusTable;
