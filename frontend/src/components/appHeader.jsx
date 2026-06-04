import React, { useEffect, useReducer, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const AppHeader = ({ onSearchPress, title = "P Chat", children }) => {
    const user = useSelector(state => state.user.user || []);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };

    return (
        <LinearGradient colors={["#4facfe", "#7b5cff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container}>
            {children}
            <Text style={styles.logo}>{title}</Text>

            <View style={styles.right}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {getInitials(user?.name)}
                    </Text>
                </View>
            </View>

        </LinearGradient>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    container: {
        height: 70,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 10,
        shadowColor: "#7b5cff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },

    logo: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 0.5,
    },

    right: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.25)",
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
});