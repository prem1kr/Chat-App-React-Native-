import { createSlice } from "@reduxjs/toolkit";

const groupMessagesSlice = createSlice({
    name: "groupMessages",
    initialState: {
        messages: [],
    },

    reducers: {
        setGroupMessages: (state, action) => {
            state.messages = action.payload;
        },

        addGroupMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        deleteGroupMessage: (state, action) => {
            state.messages = state.messages.filter(msg => msg._id !== action.payload);
        },

        updateGroupMessage: (state, action) => {
            const index = state.messages.findIndex(msg => msg._id === action.payload._id);
            if (index !== -1) {
                state.messages[index] = { ...state.messages[index], ...action.payload };
            }
        },

        clearGroupMessages: (state) => {
            state.messages = [];
        },
    },
});

export const { setGroupMessages, addGroupMessage, deleteGroupMessage, updateGroupMessage, clearGroupMessages } = groupMessagesSlice.actions;
export default groupMessagesSlice.reducer;