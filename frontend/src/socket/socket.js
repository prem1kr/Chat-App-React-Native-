import { io } from "socket.io-client";
import Constants from "expo-constants";

const { API_URL, SOCKET_URL, GOOGLE_MAPS_KEY } = Constants.expoConfig.extra;

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],

});