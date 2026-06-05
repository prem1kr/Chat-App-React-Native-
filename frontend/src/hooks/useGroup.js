import Constants from "expo-constants";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { API_URL } = Constants.expoConfig.extra;

export const createGroup = async (data) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(`${API_URL}/group/create`, data, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const getUserGroups = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/group/my-groups`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const getGroupById = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/group/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error.response.data;
    }
}


export const addMember = async (groupId, memberId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${API_URL}/group/${groupId}/add-member`, { memberId }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const removeMember = async (groupId, memberId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${API_URL}/group/${groupId}/remove-member`, { memberId }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const updateGroup = async (groupId, data) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${API_URL}/group/${groupId}/update`, data, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}


export const deleteGroup = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/group/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        return error?.response?.data;
    }
}