import api, { tags } from "../baseApi";
const { Complaints } = tags;

const complaintApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query({
      query: () => "/complaints",
      providesTags: (result) =>
        result?.complaints
          ? [
              ...result.complaints.map(({ _id }) => ({ type: Complaints, id: _id })),
              { type: Complaints, id: "LIST" },
            ]
          : [{ type: Complaints, id: "LIST" }],
    }),
    getComplaintById: builder.query({
      query: (id) => `/complaints/${id}`,
      providesTags: (result, error, id) => [{ type: Complaints, id }],
    }),
    addComplaint: builder.mutation({
      query: (payload) => ({
        url: "/complaints",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: Complaints, id: "LIST" }],
    }),
    updateComplaint: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/complaints/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: Complaints, id }],
    }),
    deleteComplaint: builder.mutation({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: Complaints, id }],
    }),
  }),
});

export const {
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useAddComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintApi;

export default complaintApi;
