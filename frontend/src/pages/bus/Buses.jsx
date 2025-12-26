import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BusTable from "./BusTable";
import { useGetBusesQuery } from "../../features/bus/BusApi";
import Loader from "../../components/ui/Loader";
import Error from "../../components/ui/Error";
import { Button } from "antd";
const Buses = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetBusesQuery();
  if (isLoading) return <Loader />;
  if (isError) return <Error message={error.error} onRetry={refetch} />;

  return (
    <div className="mt-3">
      <Button
        type="primary"
        onClick={() => navigate("/buses/create")}
        size="large"
        className="mb-3"
      >
        Add Buses
      </Button>
      <BusTable buses={data} />
      <Outlet />
    </div>
  );
};

export default Buses;
