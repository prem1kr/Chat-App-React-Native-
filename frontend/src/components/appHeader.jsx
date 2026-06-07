import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const AppHeader = ({ title = "P Chat", children, isAdmin = false, onMenuPress, onMembers }) => {
    const user = useSelector((state) => state.user.user);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };

    return (
        <LinearGradient colors={["#4facfe", "#7b5cff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container}>
            {children}
            <Text style={styles.logo}>{title}</Text>

            {isAdmin ? (
                <TouchableOpacity onPress={onMenuPress}>
                    <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.right} onPress={onMembers} >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                </TouchableOpacity>
            )}
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
        borderBottomLeftRadius: 22,
        borderTopRightRadius: 22,
        elevation: 10,
    },

    logo: {
        flex: 1,
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginLeft: 15,
    },

    right: {
        marginLeft: "auto",
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