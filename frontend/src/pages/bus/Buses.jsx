import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import BusTable from "./BusTable";
import { useGetBusesQuery } from "../../features/bus/BusApi";
import Loader from "../../components/ui/Loader";
import Error from "../../components/ui/Error";
;

const Buses = () => {
const {data, isLoading, isError , error , refetch} = useGetBusesQuery();

if (isLoading) return <Loader />;
if (isError) return <Error message={error.error} onRetry={refetch} />;

  return (
    <div className="mt-4">
 <NavLink to="create" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
  Add Buses
</NavLink>
<BusTable buses={data} />
<Outlet />

    </div>
  );
};

export default Buses;

