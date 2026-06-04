import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingButton from '../components/loadingButton';
import { signup } from '../hooks/useAuth';

const Signup = () => {
    const [role, setRole] = useState('user');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [openPopup, setOpenPopup] = useState(false);

    const handleSignup = async () => {
        try {
            if (!email || !password || !name || !role) {
                return Alert.alert("Error", "Please enter email and password");
            }
            const data = { role: role, name: name, email: email, password: password }
            setLoading(true);
            const res = await signup(data);

            if (res.success) {
                await AsyncStorage.setItem("userId", res.user.id);
                Alert.alert("Success", res.message);
                router.push("/login")
            }
        } catch (error) {
            Alert.alert("Error", error?.response?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/icon.png')} style={styles.background} resizeMode="cover">

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <SafeAreaView style={styles.overlay}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join the our chat app</Text>

                        <View style={styles.card}>
                            <View style={styles.roleContainer}>
                                <TouchableOpacity style={[styles.roleBtn, role === 'user' && styles.activeRole]} onPress={() => setRole('user')} >
                                    <Text style={[styles.roleText, role === 'user' && styles.activeText]}>User</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.roleBtn, role === 'admin' && styles.activeRole]} onPress={() => setRole('admin')} >
                                    <Text style={[styles.roleText, role === 'admin' && styles.activeText]}>Admin</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput placeholder="Full Name" placeholderTextColor="#aaa" style={styles.input} value={name} onChangeText={setName} />
                            <TextInput placeholder="Email" placeholderTextColor="#aaa" style={styles.input} value={email} onChangeText={setEmail} />
                            <TextInput placeholder="Password" placeholderTextColor="#aaa" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
                            <LoadingButton title={`Signup as ${role}`} onPress={handleSignup} loading={loading} style={styles.signupBtn} />

                            <Pressable onPress={() => router.push('/login')} >
                                <Text style={styles.switchText}> Already have an account? <Text style={styles.link}> Login</Text> </Text>
                            </Pressable>

                        </View>

                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Signup;

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
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
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
        color: '#555',
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
        color: '#333',
        elevation: 20,
    },

    signupBtn: {
        backgroundColor: '#4ec28d',
        borderRadius: 12,
        alignItems: 'center',
    },

    signupText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    switchText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#666',
    },

    link: {
        color: '#4ec28d',
        fontWeight: 'bold',
    },
});