import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tags = {
  Users: "Users",
  Students: "Students",
  Drivers: "Drivers",
  Buses: "Buses",
  Complaints: "Complaints",
};

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json"); // 👈 REQUIRED

      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: Object.values(tags),
  endpoints: () => ({}),
});

export default api;
