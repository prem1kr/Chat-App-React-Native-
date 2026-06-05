import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/redux/slices/userSlice";
import profileReducer from "@/redux/slices/profileSlice";
import usersReducer from "@/redux/slices/usersSlice";


export const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        users: usersReducer,
    }
});