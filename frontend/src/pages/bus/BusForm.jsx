import React, { useEffect, useMemo } from "react";
import { FaBus } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddBusMutation,
  useGetBusByIdQuery,
  useUpdateBusMutation,
} from "../../features/bus/BusApi";
import FormGenerator from "../../components/formElements/FormGenerator";
import Drawer from "../../components/ui/Drawer";
import { useGetUserListQuery } from "../../features/user/userApi";
;
const BusForm = () => {
  const { id } = useParams();
  const { data } = useGetBusByIdQuery(id, { skip: !id });
  const [addBus] = useAddBusMutation();
  const [updateBus] = useUpdateBusMutation();
  const { data: drivers } = useGetUserListQuery({ role: "driver" });

  const handleSubmit = async (bus) => {
    if (id) {
      await updateBus({ id, ...bus });
      toast.success("Bus updated successfully!");
    } else {
      await addBus(bus);
      toast.success("Bus created successfully!");
    }
  };

  const busFormFields = [
    {
      name: "busNumber",
      label: "Bus Number",
      icon: <FaBus className="text-blue-500" />,
      type: "text",
      required: true,
      placeholder: "Enter bus number",
    },
    {
      name: "status",
      label: "Status",
      icon: <AiOutlineCheckCircle className="text-green-500" />,
      type: "select",
      required: true,
      options: ["active", "inactive", "maintenance"],
      placeholder: "Select status",
    },
    {
      name: "driverId",
      label: "Driver",
      icon: <MdInfo className="text-purple-500" />,
      type: "select",
      required: true,
      options: drivers?.users,
      placeholder: "Select driver",
    },
  ];

  return (
    <Drawer title={`${id ? "Update" : "Add"} Bus`}>
      <FormGenerator
        fields={busFormFields}
        onSubmit={handleSubmit}
        defaultValues={data?.bus}
      />
    </Drawer>
  );
};

export default BusForm;
