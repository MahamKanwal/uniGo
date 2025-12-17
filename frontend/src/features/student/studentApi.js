import { apiRequest } from "../../utils/helperFunction";
import api, { tags } from "../baseApi";

const { Students } = tags;

const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => apiRequest("/users?role=student"),
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: Students, id })),
              { type: Students, id: "LIST" },
            ]
          : [{ type: Students, id: "LIST" }],
    }),

    getStudentById: builder.query({
      query: (id) => apiRequest(`/users?role=students/${id}`),
      providesTags: (result, error, id) => [{ type: Students, id }],
    }),

    addStudent: builder.mutation({
      query: (newStudent) => apiRequest("/students", "POST", newStudent),
      invalidatesTags: [{ type: Students, id: "LIST" }],
    }),

    updateStudent: builder.mutation({
      query: ({ id, ...data }) => apiRequest(`/students/${id}`, "PUT", data),
      invalidatesTags: (result, error, { id }) => [{ type: Students, id }],
    }),

    deleteStudent: builder.mutation({
      query: (id) => apiRequest(`/students/${id}`, "DELETE"),
      invalidatesTags: (result, error, id) => [{ type: Students, id }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;

export default studentApi;


