// userApi.js
import api from "../baseApi";
import { apiRequest } from "../../utils/helperFunction";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =======================================
    // GET USERS
    // =======================================
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
    // =======================================
    // USER REGISTER / SIGNUP
    // =======================================
    registerUser: builder.mutation({
      query: (newUser) => apiRequest("/users/register", "POST", newUser),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // =======================================
    // USER LOGIN
    // =======================================
    loginUser: builder.mutation({
      query: (credentials) => apiRequest("/users/login", "POST", credentials),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
} = userApi;

export default userApi;


