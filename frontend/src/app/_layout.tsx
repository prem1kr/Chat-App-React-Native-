import { Stack } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store/store';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from '@/redux/slices/userSlice';
import { userInfo } from "../hooks/useAuth";
import { socket } from "../socket/socket";

export default function RootLayout() {

  function AppInitializer() {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        let user = null;
        if (token) {
          const response = await userInfo();
          if (response?.success) {
            user = response.user;
            dispatch(setUser(response.user));
            setUserData(user);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
          }
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          user = storedUser ? JSON.parse(storedUser) : null;
          dispatch(setUser(user));
          setUserData(user);
        }

      } catch (error) {
        console.log(error);
      }

    };

    useEffect(() => {
      loadUserData();
    }, []);


    useEffect(() => {
      if (!userData?._id) return;
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        socket.emit("join", userData?._id);
      });
      return () => {
        socket.off("connect");
        socket.disconnect();

      }
    }, [userData]);



    return null;
  }

  return (
    <Provider store={store} >
      <AppInitializer />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
      </Stack>
    </Provider>
  );
}
