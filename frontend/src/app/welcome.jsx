import { Text, StyleSheet, Animated, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true, }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true, })
    ]).start();

    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        setTimeout(() => {
          if (!storedUser) {
            return router.replace('/login');
          }
          const user = JSON.parse(storedUser);
          if (user.role === "admin") {
            router.replace('/admin/home');
          } else {
            router.replace('/users/home');
          }
        }, 3000);

      } catch (error) {
        console.log(error);
        router.replace('/login');
      }
    };
    checkUser();
  }, []);

  return (
    <LinearGradient colors={['#4ec28d', '#1fa2ff']} style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}> Drive Now</Text>
        <Text style={styles.subtitle}>Your Chat, Your Freedom</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerContainer: {
    alignItems: 'center',
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: '#e0f7ff',
    marginTop: 8,
  },
});