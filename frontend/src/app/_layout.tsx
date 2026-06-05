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
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          dispatch(setUser(parsedUser));
        } else {
          const response = await userInfo();
          if (response?.success) {
            dispatch(setUser(response.user));
          }
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
