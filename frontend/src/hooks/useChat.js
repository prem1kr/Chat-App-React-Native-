import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "@/socket/socket";

const { API_URL } = Constants.expoConfig.extra;

export const createChat = async (receiverId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(`${API_URL}/chat/create`, { receiverId }, { headers: { Authorization: `Bearer ${token}` } });
    const chat = response.data.chat;
    socket.emit("joinChat", chat._id);
    return response.data;

  } catch (error) {
    return error?.response?.data;
  }
};


export const getChatList = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chat/list`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;

  } catch (error) {
    return error?.response?.data;
  }
};


export const getChats = async (chatId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
    socket.emit("joinChat", chatId);
    return response.data;

  } catch (error) {
    return error?.response?.data;
  }
};


export const getChats = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chat/getAllChats`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;

  } catch (error) {
    return error?.response?.data;
  }
};