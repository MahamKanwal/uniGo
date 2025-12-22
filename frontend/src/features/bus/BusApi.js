import { apiRequest } from "../../utils/helperFunction";
import api, { tags } from "../baseApi";

const { Buses } = tags;

const busApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBuses: builder.query({
      query: () => apiRequest("/buses"),
      providesTags: (result) =>
        result?.buses
          ? [
              ...result.buses.map((bus) => ({
                type: Buses,
                id: bus._id,
              })),
              { type: Buses, id: "LIST" },
            ]
          : [{ type: Buses, id: "LIST" }],
    }),

    getBusById: builder.query({
      query: (id) => apiRequest(`/buses/${id}`),
      providesTags: (result, error, id) => [{ type: Buses, id }],
    }),

    addBus: builder.mutation({
      query: (newBus) => apiRequest("/buses", "POST", newBus),
      invalidatesTags: [{ type: Buses, id: "LIST" }],
    }),

    updateBus: builder.mutation({
      query: ({ id, ...data }) => apiRequest(`/buses/${id}`, "PUT", data),
      invalidatesTags: (result, error, { id }) => [
        { type: Buses, id },
        { type: Buses, id: "LIST" },
      ],
    }),

    deleteBus: builder.mutation({
      query: (id) => apiRequest(`/buses/${id}`, "DELETE"),
      invalidatesTags: (result, error, id) => [
        { type: Buses, id },
        { type: Buses, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBusesQuery,
  useGetBusByIdQuery,
  useAddBusMutation,
  useUpdateBusMutation,
  useDeleteBusMutation,
} = busApi;

export default busApi;
