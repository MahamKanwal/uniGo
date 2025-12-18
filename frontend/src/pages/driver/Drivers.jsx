import React from 'react'
import { Outlet } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import Error from "../../components/ui/Error";
import { useGetDriverListQuery, useGetDriversQuery } from '../../features/driver/driverApi';
import DriverTable from './DriverTable';

const Drivers = () => {
 const { data, isLoading, isError, error, refetch } = useGetDriversQuery();
 const {data: drivers} = useGetDriverListQuery();
 console.log(drivers);
   if (isLoading) return <Loader />;
   if (isError) return <Error message={error.error} onRetry={refetch} />;
 
   return (
     <div className="mt-4">
       <DriverTable drivers={data} />
       <Outlet />
     </div>
  )
}

export default Drivers;
