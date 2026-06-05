import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: [],
    },

    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setUpdateProfile: (state, action) => {
            state.profile = state.profile.map((item) => item._id === action.payload._id ? { ...item, ...action.payload } : item);
        }
    }
});

export const {setProfile,setUpdateProfile} = profileSlice.actions;
export default profileSlice.reducer;
