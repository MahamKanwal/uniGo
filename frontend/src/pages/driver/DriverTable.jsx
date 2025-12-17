import React from "react";
import { Image, Space, Tag, Button, Table } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation } from "../../features/user/userApi";

const DriverTable = ({ drivers }) => {
  const navigate =  useNavigate();
  const [deleteDriver] =  useDeleteUserMutation();
   
  const handleDelete = (id) => {
  deleteDriver(id);
  toast.success("Driver deleted successfully!");
  };

const driverColumns = [
  {title: "S.No",key: "sno",render: (_, __, index) => index + 1,},
 
  // {title: "Image",dataIndex: "driver_image",key: "driver_image",render: (img) => (
  // <Image src={img} width={40} height={40}
  //   style={{ borderRadius: "50%" }}/>),},

  {title: "Name",dataIndex: "name",key: "name",},
  {title: "Licence Number", dataIndex: "licence", key: "licence"},
  {title: "Email", dataIndex: "email", key: "email",},
  {title: "CNIC", dataIndex: "cnic", key: "cnic",},
  {title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber",},
 {title: "Police Clearance", dataIndex: "policeClearance", key: "policeClearance", render: (policeClearance) => (
  <Tag color={policeClearance === "verified" ? "blue" : "red"}>
    {policeClearance.toUpperCase()}
  </Tag>
)},
{title: "Gender", dataIndex: "gender", key: "gender", render: (gender) => (
  <Tag color={gender === "male" ? "blue" : "pink"}>
    {gender.toUpperCase()}
  </Tag>
)},

  {title: "City", dataIndex: "city", key: "city",},
  {title: "Action", key: "action", render: (_, record) => (
       <Space>
        <Button type="link">View</Button>
        <Button type="link" onClick={() => navigate(`/drivers/edit/${record._id}`)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      </Space>
    ),
  },
];

  return (
    <div className="max-w-7xl mx-auto">
      <Table columns={driverColumns} dataSource={drivers.users}  rowKey="_id"/>
    </div>
  );
};

export default DriverTable;


