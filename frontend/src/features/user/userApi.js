// userApi.js
import api, { tags } from "../baseApi";
import { apiRequest } from "../../utils/helperFunction";
const {Users} = tags;

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query({
      query: () => apiRequest("/users"),
      providesTags: (result) =>
        result 
          ? [
              ...result.map(({ id }) => ({ type: "Users", id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
  
 getUserById: builder.query({
      query: (id) => apiRequest(`/users/${id}`),
      providesTags: (result, error, id) => [{ type: Users, id }],
    }),

    registerUser: builder.mutation({
      query: (newUser) => apiRequest("/users/register", "POST", newUser),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    loginUser: builder.mutation({
      query: (credentials) => apiRequest("/users/login", "POST", credentials),
    }),


    deleteUser: builder.mutation({
      query: (id) => apiRequest(`/users/${id}`, "DELETE"),
      invalidatesTags: (result, error, id) => [{ type: Users, id }],
    }),
    
        updateUser: builder.mutation({
          query: ({ id, ...data }) => apiRequest(`/users/${id}`, "PUT", data),
          invalidatesTags: (result, error, { id }) => [{ type: Users, id }],
        }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;

export default userApi;

