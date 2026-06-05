import { Stack } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store/store';
import { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from '@/redux/slices/userSlice';
import { userInfo } from "../hooks/useAuth";

export default function RootLayout() {
  function AppInitializer() {
    const dispatch = useDispatch();

    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const response = await userInfo();
          if (response?.success) {
            dispatch(setUser(response.user));
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
          }
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          const user = storedUser ? JSON.parse(storedUser) : null;
          dispatch(setUser(user));
        }

      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      loadUserData();
    }, []);

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
