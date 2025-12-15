import React from "react";
import { Outlet } from "react-router-dom";
import StudentTable from "./StudentTable";
import { useGetStudentsQuery } from "../../features/student/studentApi";
import Loader from "../../components/ui/Loader";
import Error from "../../components/ui/Error";

const Students = () => {
  const { data, isLoading, isError, error, refetch } = useGetStudentsQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Error message={error.error} onRetry={refetch} />;

  return (
    <div className="mt-4">
      <StudentTable students={data} />
      <Outlet />
    </div>
  );
};

export default Students;
