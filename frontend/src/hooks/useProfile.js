import axios from "axios";
import Constants from "expo-constants";

const { API_URL, SOCKET_URL, GOOGLE_MAPS_KEY } = Constants.expoConfig.extra;

export const addEditProfile = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/profile/edit`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/profile/get/${userId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const getAllProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile/get-all`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}