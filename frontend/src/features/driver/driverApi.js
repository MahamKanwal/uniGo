import { apiRequest } from "../../utils/helperFunction";
import api, { tags } from "../baseApi";

const { Drivers } = tags;

const driverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* ======================
       GET ALL DRIVERS
    ====================== */
    getDrivers: builder.query({
      query: () => apiRequest("/users?role=driver"),
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }) => ({
                type: Drivers,
                id: _id,
              })),
              { type: Drivers, id: "LIST" },
            ]
          : [{ type: Drivers, id: "LIST" }],
    }),

    /* ======================
       DRIVER DROPDOWN LIST
    ====================== */
    getDriverList: builder.query({
      query: () => apiRequest("/users?role=driver&list=true"),
      providesTags: [{ type: Drivers, id: "LIST" }],
    }),

    /* ======================
       GET DRIVER BY ID
    ====================== */
    getDriverById: builder.query({
      query: (id) => apiRequest(`/drivers/${id}`),
      providesTags: (result, error, id) => [{ type: Drivers, id }],
    }),

    /* ======================
       ADD DRIVER
    ====================== */
    addDriver: builder.mutation({
      query: (newDriver) =>
        apiRequest("/drivers", "POST", {
          ...newDriver,
          role: "driver",
        }),
      invalidatesTags: [{ type: Drivers, id: "LIST" }],
    }),

    /* ======================
       UPDATE DRIVER
    ====================== */
    updateDriver: builder.mutation({
      query: ({ id, ...data }) => apiRequest(`/drivers/${id}`, "PUT", data),
      invalidatesTags: (result, error, { id }) => [
        { type: Drivers, id },
        { type: Drivers, id: "LIST" },
      ],
    }),

    /* ======================
       DELETE DRIVER
    ====================== */
    deleteDriver: builder.mutation({
      query: (id) => apiRequest(`/drivers/${id}`, "DELETE"),
      invalidatesTags: (result, error, id) => [
        { type: Drivers, id },
        { type: Drivers, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverListQuery,
  useGetDriverByIdQuery,
  useAddDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driverApi;

export default driverApi;
