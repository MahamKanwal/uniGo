import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const tags = { Users: "Users", Students: "Students", Drivers: "Drivers", Buses: "Buses"};
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: Object.values(tags),
  endpoints: () => ({}),
});

export default api;
