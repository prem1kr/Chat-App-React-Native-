import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../hooks/useAuth";

export default function Settings() {
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(false);
    const user = useSelector(state => state.user.user || []);
    const router = useRouter();

    const handleLogout = async () => {

        const response = await logout();
        if (response.success) {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('token');
            router.push('/login');
        }
    };

    return (
        <>
            <AppHeader title="Settings" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >

                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.name}> {user?.name} </Text>
                    <Text style={styles.email}> {user?.email}  </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Account </Text>

                    <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/users/pages/profile')} >
                        <Ionicons name="person-outline" size={22} color="#4facfe" />
                        <Text style={styles.settingText}> Edit Profile </Text>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="lock-closed-outline" size={22} color="#4facfe" />
                        <Text style={styles.settingText}>  Change Password </Text>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Appearance </Text>

                    <View style={styles.settingItem}>
                        <Ionicons name="moon-outline" size={22} color="#7b5cff" />
                        <Text style={styles.settingText}> Dark Mode </Text>
                        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: "#dbeafe", true: "#7b5cff" }} />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} >
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                    <Text style={styles.logoutText}> Logout </Text>
                </TouchableOpacity>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7ff",
        padding: 12,
    },

    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        paddingVertical: 25,
        alignItems: "center",
        marginBottom: 20,
        elevation: 4,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
    },

    name: {
        marginTop: 12,
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    email: {
        marginTop: 4,
        color: "#64748b",
    },

    section: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 8,
        marginBottom: 18,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#64748b",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
    },

    settingText: {
        flex: 1,
        marginLeft: 14,
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    logoutBtn: {
        backgroundColor: "#ef4444",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        borderRadius: 18,
        marginTop: 10,
        marginBottom: 120,
    },

    logoutText: {
        color: "#fff",
        marginLeft: 8,
        fontWeight: "700",
        fontSize: 16,
    },
});