// userApi.js
import autoApi from "../autoApi";

const userApi = autoApi("users", "Users");
 
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
 
export default userApi;