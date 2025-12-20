import React from 'react'
import { Button, Space, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useDeleteBusMutation } from '../../features/bus/BusApi';

const BusTable = ({buses}) => {
  const navigate = useNavigate();
 const [deleteBus] =  useDeleteBusMutation();
   
  const handleDelete = (id) => {
deleteBus(id);
  toast.success("Driver deleted successfully!");
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
      dataIndex: "driver",
      key: "driver",
      render: (driver) => driver?.name ,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link">
            View
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/buses/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
         <Table columns={busColumns} dataSource={buses.buses} rowKey="_id" />
    </div>
  )
}

export default BusTable
