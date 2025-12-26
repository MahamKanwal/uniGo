import React from "react";
import { useGetComplaintsQuery } from "../../features/complaint/complaintApi";
import Loader from "../../components/ui/Loader";
import Error from "../../components/ui/Error";
import { Outlet, useNavigate } from "react-router-dom";
import ComplaintTable from "./ComplaintTable";
import { Button } from "antd";

const Complaints = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, error } = useGetComplaintsQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Error message={error.error} onRetry={refetch} />;

  return (
    <div className="mt-4">
      <Button type="primary" onClick={() => navigate("/complaints/create")} size="large" className="mb-3">
        Add Complaints
      </Button>
      <ComplaintTable complaints={data} />
      <Outlet />
    </div>
  );
};

export default Complaints;
