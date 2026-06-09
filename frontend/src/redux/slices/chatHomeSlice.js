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
            const exists = state.chatHome.some(chat => chat._id === action.payload._id);
            if (!exists) {
                state.chatHome.unshift(action.payload);
            }
        },

      updateChat: (state, action) => {
  console.log("UPDATE CHAT:", action.payload);

  const index = state.chatHome.findIndex(
    chat => chat._id === action.payload._id
  );

  console.log("FOUND INDEX:", index);

  if (index !== -1) {
    state.chatHome[index] = {
      ...state.chatHome[index],
      ...action.payload,
    };

    state.chatHome.sort(
      (a, b) =>
        new Date(b.lastMessageTime || b.updatedAt) -
        new Date(a.lastMessageTime || a.updatedAt)
    );
  }
},

        removeChat: (state, action) => {
            state.chatHome = state.chatHome.filter(chat => chat._id !== action.payload);
        },
    },
});

export const { setChats, addChat, updateChat, removeChat } = chatHomeSlice.actions;
export default chatHomeSlice.reducer;