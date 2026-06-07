import { View, Text, StyleSheet, TextInput, ImageBackground, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingButton from '../components/loadingButton';
import { login } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                return Alert.alert("Error", "Please enter email and password");
            }
            setLoading(true);
            const data = { email, password };
            const res = await login(data);

            if (res.success) {
                await AsyncStorage.setItem("token", res.token);
                await AsyncStorage.setItem("user", JSON.stringify(res.user));
                await AsyncStorage.setItem("userId", res.user.id);
                Alert.alert("Success", res.message);
                if (res.user.role === "admin") {
                    router.replace("/admin/dashboard");
                } else {
                    router.replace("/users/home");
                }
            }

        } catch (error) {
            Alert.alert("Error", error?.res?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/icon.png')} style={styles.background} resizeMode="cover">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={styles.overlay}>

                        <Text style={styles.title}>P Chat</Text>
                        <Text style={styles.subtitle}>Login to continue</Text>
                        <View style={styles.card}>
                            <TextInput placeholder="Email" placeholderTextColor="#aaa" style={styles.input} value={email} onChangeText={setEmail} />
                            <TextInput placeholder="Password" placeholderTextColor="#aaa" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
                            <LoadingButton title={'Login'} onPress={handleLogin} loading={loading} style={styles.loginBtn} />

                            <Pressable onPress={() => router.push('/signup')} >
                                <Text style={styles.switchText}> create an account?
                                    <Text style={styles.link}> Signup</Text>
                                </Text>
                            </Pressable>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </ImageBackground>
    );
};

export default Login;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0bf451',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: '#ddd',
        textAlign: 'center',
        marginBottom: 20,
    },

    card: {
        borderRadius: 20,
        padding: 20,
    },

    roleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,

    },

    roleBtn: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 12,
    },

    activeRole: {
        backgroundColor: '#4ec28d',
    },

    roleText: {
        color: '#2c2c2c',
        fontWeight: '600',
    },

    activeText: {
        color: '#fff',
    },

    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 45,
        marginBottom: 15,
        color: '#131313',
        elevation: 20
    },

    loginBtn: {
        backgroundColor: '#4ec28d',
        borderRadius: 12,
        alignItems: 'center',

    },

    loginText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#ffffff',
    },

    link: {
        color: '#1bff76',
        fontWeight: 'bold',
    },
});