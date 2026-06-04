import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";

const dummyChats = [
    {
        id: "1",
        name: "Prem Kumar",
        lastMessage: "Bro where are you?",
        time: "2:10 PM",
        unread: 2,
    },
    {
        id: "2",
        name: "Rahul Sharma",
        lastMessage: "Let’s meet tomorrow",
        time: "1:05 PM",
        unread: 0,
    },
    {
        id: "3",
        name: "Anjali",
        lastMessage: "Ok got it 👍",
        time: "Yesterday",
        unread: 5,
    },
];

export default function UserHome() {
    const [search, setSearch] = useState("");

    const filteredChats = dummyChats.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatCard} activeOpacity={0.85}>

            <View style={styles.avatar}>
                <Text style={styles.avatarText}> {getInitials(item.name)} </Text>
                <View style={styles.onlineDot} />
            </View>

            <View style={styles.chatInfo}>
                <View style={styles.row}>
                    <Text style={styles.name}> {item.name} </Text>
                    <Text style={styles.time}> {item.time} </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.message} numberOfLines={1}>{item.lastMessage} </Text>
                    {item.unread > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}> {item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar backgroundColor="#4facfe" barStyle="light-content" />
            <AppHeader  />

            <View style={styles.container}>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20}  color="#94a3b8"/>
                    <TextInput placeholder="Search chats..." placeholderTextColor="#94a3b8"  value={search} onChangeText={setSearch} style={styles.searchInput} />
                </View>

                <FlatList data={filteredChats} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7ff",
        paddingHorizontal: 12,
        paddingTop: 12,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        height: 50,
        borderRadius: 16,
        paddingHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#4facfe",
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: "#111827",
    },

    chatCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 14,
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#eef2ff",
        elevation: 4,
        shadowColor: "#7b5cff",
        shadowOffset: { width: 0, height: 3},
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },

    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        position: "relative",
    },

    onlineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#22c55e",
        borderWidth: 2,
        borderColor: "#fff",
        position: "absolute",
        bottom: 2,
        right: 2,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    chatInfo: {
        flex: 1,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    name: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
    },

    time: {
        fontSize: 12,
        color: "#94a3b8",
        fontWeight: "500",
    },

    message: {
        flex: 1,
        marginTop: 4,
        marginRight: 10,
        fontSize: 14,
        color: "#64748b",
    },

    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
});