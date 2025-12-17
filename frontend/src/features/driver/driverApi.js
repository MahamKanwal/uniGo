import { apiRequest } from "../../utils/helperFunction";
import api, { tags } from "../baseApi";

const { Drivers } = tags;

const driverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: () => apiRequest("/users?role=driver"),
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: Drivers, id })),
              { type: Drivers, id: "LIST" },
            ]
          : [{ type: Drivers, id: "LIST" }],
    }),

    getDriverById: builder.query({
      query: (id) => apiRequest(`/drivers/${id}`),
      providesTags: (result, error, id) => [{ type: Drivers, id }],
    }),

    addDriver: builder.mutation({
      query: (newDriver) => apiRequest("/drivers", "POST", newDriver),
      invalidatesTags: [{ type: Drivers, id: "LIST" }],
    }),

    updateDriver: builder.mutation({
      query: ({ id, ...data }) => apiRequest(`/drivers/${id}`, "PUT", data),
      invalidatesTags: (result, error, { id }) => [{ type: Drivers, id }],
    }),

    deleteDriver: builder.mutation({
      query: (id) => apiRequest(`/drivers/${id}`, "DELETE"),
      invalidatesTags: (result, error, id) => [{ type: Drivers, id }],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useAddDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driverApi;

export default driverApi;


