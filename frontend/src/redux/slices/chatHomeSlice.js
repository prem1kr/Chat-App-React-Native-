import { createSlice } from "@reduxjs/toolkit";

const chatHomeSlice = createSlice({
    name: "chatHome",
    initialState: {
        chatHome: [],
    },

    reducers: {
        setChats: (state, action) => {
            state.chatHome = action.payload;
        },

        addChat: (state, action) => {
            state.chatHome.unshift(action.payload);
        },

        updateChat: (state, action) => {
            const index = state.chatHome.findIndex(chat => chat._id === action.payload._id);
            if (index !== -1) {
                state.chatHome[index] = action.payload;
            }
        },

        removeChat: (state, action) => {
            state.chatHome = state.chatHome.filter(chat => chat._id !== action.payload);
        },
    },
});

export const { setChats, addChat, updateChat, removeChat } = chatHomeSlice.actions;
export default chatHomeSlice.reducer;