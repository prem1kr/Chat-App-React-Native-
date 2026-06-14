import { createSlice } from "@reduxjs/toolkit";

const chatHomeSlice = createSlice({
    name: "chatHome",
    initialState: {
        chatHome: [],
    },

    reducers: {
        setChats: (state, action) => {
            state.chatHome = Array.isArray(action.payload)
                ? action.payload.filter(Boolean)
                : [];
        },

        addChat: (state, action) => {
            if (!action.payload?._id) return;

            const exists = state.chatHome.some(
                chat => chat && chat._id === action.payload._id
            );

            if (!exists) {
                state.chatHome.unshift(action.payload);
            }
        },

        updateChat: (state, action) => {
            if (!action.payload?._id) {
                console.log("Invalid updateChat payload:", action.payload);
                return;
            }

            const index = state.chatHome.findIndex(
                chat => chat && chat._id === action.payload._id
            );

            if (index !== -1) {
                state.chatHome[index] = {
                    ...state.chatHome[index],
                    ...action.payload,
                };
            } else {
                state.chatHome.unshift(action.payload);
            }

            state.chatHome = state.chatHome.filter(Boolean);

            state.chatHome.sort((a, b) => {
                const dateA = new Date(a?.lastMessageTime || a?.updatedAt || 0);
                const dateB = new Date(b?.lastMessageTime || b?.updatedAt || 0);

                return dateB - dateA;
            });
        },

        removeChat: (state, action) => {
            state.chatHome = state.chatHome.filter(
                chat => chat && chat._id !== action.payload
            );
        },
    },
});

export const {
    setChats,
    addChat,
    updateChat,
    removeChat,
} = chatHomeSlice.actions;

export default chatHomeSlice.reducer;
