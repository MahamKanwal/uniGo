import { combineReducers, configureStore } from "@reduxjs/toolkit";
import api from "../features/baseApi";

const rootReducer = combineReducers({
    // user: userReducer,
    [api.reducerPath] :api.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});