import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const { API_URL, SOCKET_URL, GOOGLE_MAPS_KEY } = Constants.expoConfig.extra;

console.log(API_URL)
export const userInfo = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/auth/user`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return error?.response?.data;
    }
};


export const getAlluser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/auth/all-user/${userId}`);
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const signup = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, data);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const login = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}