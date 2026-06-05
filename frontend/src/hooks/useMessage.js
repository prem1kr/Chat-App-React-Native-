import Constants from "expo-constants";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { API_URL } = Constants.expoConfig.extra;

export const sendMessage = async (data) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(`${API_URL}/message/send`, data, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const getChatMessages = async (chatId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/message/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const getGroupMessages = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/message/group/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const markAsDelivered = async (messageId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${API_URL}/message/delivered/${messageId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const markAsRead = async (messageId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${API_URL}/message/read/${messageId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const deleteMessage = async (messageId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/message/${messageId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}