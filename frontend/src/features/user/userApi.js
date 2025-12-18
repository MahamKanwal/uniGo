import api, { tags } from "../baseApi";
import { apiRequest } from "../../utils/helperFunction";

const { Users } = tags;

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* ======================
       GET USERS BY ROLE
    ====================== */
   getUsers: builder.query({
  query: (role) => apiRequest(`/users?role=${role}`),
  providesTags: (result, error, role) =>
    result?.users
      ? [
          ...result.users.map(({ _id }) => ({
            type: Users,
            id: _id,
          })),
          { type: Users, id: `LIST-${role}` },
        ]
      : [{ type: Users, id: `LIST-${role}` }],
}),


    /* ======================
       GET USER BY ID
    ====================== */
    getUserById: builder.query({
      query: (id) => apiRequest(`/users/${id}`),
      providesTags: (result, error, id) => [{ type: Users, id }],
    }),

    /* ======================
       REGISTER USER
    ====================== */
    registerUser: builder.mutation({
      query: (newUser) =>
        apiRequest("/users/register", "POST", newUser),
      invalidatesTags: [{ type: Users, id: "LIST" }],
    }),

    /* ======================
       LOGIN USER
    ====================== */
    loginUser: builder.mutation({
      query: (credentials) =>
        apiRequest("/users/login", "POST", credentials),
    }),

    /* ======================
       UPDATE USER
    ====================== */
    updateUser: builder.mutation({
      query: ({ id, ...data }) =>
        apiRequest(`/users/${id}`, "PUT", data),
      invalidatesTags: (result, error, { id }) => [
        { type: Users, id },
      ],
    }),

    /* ======================
       DELETE USER
    ====================== */
   deleteUser: builder.mutation({
  query: (id) => apiRequest(`/users/${id}`, "DELETE"),
  invalidatesTags: (result, error, { id, role }) => [
    { type: Users, id },
    { type: Users, id: `LIST-${role}` },
  ],
}),


  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export default userApi;
