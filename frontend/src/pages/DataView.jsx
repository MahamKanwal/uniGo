import React from "react";
import { Modal, Row, Col } from "antd";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const DataView = ({ data, visible, onClose }) => {
  if (!data) return null;

  const { pathname } = useLocation();
  const name = pathname.split("/")[1];

  const formatValue = (key, value) => {
    const cond = key == "createdAt" || key == "updatedAt";
    if (value && cond) {
      return dayjs(value).format("DD MMM YYYY");
    }
    return value?.toString();
  };
  const details = Object.entries(data).filter(
    ([key]) => !key.toLowerCase().includes("id")
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      width={600}
      height={"100vh"}
    >
      <h1 className="font-bold text-2xl mb-2 capitalize">{name} Informtaion</h1>
      <Row gutter={16}>
        {details.map(([key, value], index) => (
          <Col span={12} key={index}>
            <h4 className="text-md mb-1 font-bold capitalize">{key}</h4>
            <p className="text-gray-900 capitalize">
              {formatValue(key, value)}
            </p>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default DataView;
