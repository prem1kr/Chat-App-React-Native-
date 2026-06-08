import { createSlice } from "@reduxjs/toolkit";

const chatMessagesSlice = createSlice({
    name: "chatMessages",
    initialState: {
        messages: [],
    },

    reducers: {
        setChatMessages: (state, action) => {
            state.messages = action.payload;
        },

        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        deleteMessage: (state, action) => {
            state.messages = state.messages.filter(
                msg => msg._id !== action.payload
            );
        },

        updateMessage: (state, action) => {
            const index = state.messages.findIndex(msg => msg._id === action.payload._id);
            if (index !== -1) {
                state.messages[index] = { ...state.messages[index], ...action.payload };
            }
        },

        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const { setChatMessages, addMessage, deleteMessage, updateMessage, clearMessages } = chatMessagesSlice.actions;
export default chatMessagesSlice.reducer;