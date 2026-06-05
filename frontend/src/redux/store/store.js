import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/redux/slices/userSlice";
import profileReducer from "@/redux/slices/profileSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer
    }
});