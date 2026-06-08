import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/redux/slices/userSlice";
import profileReducer from "@/redux/slices/profileSlice";
import usersReducer from "@/redux/slices/usersSlice";
import chatHomeReducer from "@/redux/slices/chatHomeSlice";
import chatMessagesReducer from "@/redux/slices/chatMessages";
import groupMessagesReducer from "@/redux/slices/groupMessage";


export const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        users: usersReducer,
        chatHome: chatHomeReducer,
        chatMessages: chatMessagesReducer,
        groupMessages: groupMessagesReducer,

    }
});