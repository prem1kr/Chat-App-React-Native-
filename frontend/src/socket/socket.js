import { io } from "socket.io-client";
import Constants from "expo-constants";

const { SOCKET_URL } = Constants.expoConfig.extra;
export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});