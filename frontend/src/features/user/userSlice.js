import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")): null;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUser: (_, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            return action.payload;
        },

        logoutUser: () => {
            localStorage.removeItem("user");
            return {};
        },
    },
});

export const { getUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
