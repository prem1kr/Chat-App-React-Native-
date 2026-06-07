import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar, Image } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { socket } from "@/socket/socket";
import { getChatList } from "../../../hooks/useChat";
import { getUserGroups } from "../../../hooks/useGroup";
import { useRouter } from "expo-router";

export default function UserHome() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");

    const loadData = async () => {
        try {
            const [chatRes, groupRes] = await Promise.all([getChatList(), getUserGroups()]);
            const chats = chatRes?.chats?.map((chat) => ({ ...chat, type: "chat" })) || [];
            const groups = groupRes?.groups?.map((group) => ({ ...group, type: "group" })) || [];
            const merged = [...chats, ...groups].sort((a, b) =>
                new Date(b.lastMessageTime || b.updatedAt) -
                new Date(a.lastMessageTime || a.updatedAt)
            );
            setItems(merged);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadData();
        socket.on("chatCreated", loadData);
        socket.on("groupCreated", loadData);
        socket.on("groupUpdated", loadData);
        socket.on("groupDeleted", loadData);
        socket.on("newMessage", loadData);
        return () => {
            socket.off("chatCreated", loadData);
            socket.off("groupCreated", loadData);
            socket.off("groupUpdated", loadData);
            socket.off("groupDeleted", loadData);
            socket.off("newMessage", loadData);

        };
    }, []);

    const getName = (item) => {
        if (item.type === "group") {
            return item.groupName;
        }
        return item?.participants?.[0]?.name || "Unknown";
    };

    const getAvatar = (item) => {
        const name = getName(item);
        return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    };
    const formatTime = (time) => {
        if (!time) return "";
        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredItems = items.filter((item) =>
        getName(item).toLowerCase().includes(search.toLowerCase())
    );

    const openItem = useCallback(
        (item) => {
            if (item.type === "group") {
                router.push({
                    pathname: "/users/pages/group",
                    params: { groupId: item._id },
                });
            } else {
                router.push({
                    pathname: "/users/pages/chat",
                    params: { chatId: item._id },
                });
            }
        }, [router]);


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatCard} activeOpacity={0.85} onPress={() => openItem(item)}>

            {item.type === "group" && item.groupImage ? (
                <Image source={{ uri: item.groupImage }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, item.type === "group" && { backgroundColor: "#22c55e" }]} >
                    <Text style={styles.avatarText}> {item.type === "group" ? getAvatar(item) : getAvatar(item)}   </Text>
                </View>
            )}

            <View style={styles.chatInfo}>
                <View style={styles.row}>
                    <Text style={styles.name}> {getName(item)} </Text>
                    <Text style={styles.time}> {formatTime(item.lastMessageTime || item.updatedAt)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.message} numberOfLines={1}> {item.lastMessage || "No messages yet"}</Text>
                    {item.type === "group" && (<Ionicons name="people" size={18} color="#22c55e" />)}
                </View>

            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar backgroundColor="#4facfe" barStyle="light-content" />
            <AppHeader  title="P-Chat"/>

            <View style={styles.container}>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput placeholder="Search chats & groups..." placeholderTextColor="#94a3b8" value={search}
                        onChangeText={setSearch} style={styles.searchInput} />
                </View>

                <FlatList data={filteredItems} keyExtractor={(item) => item._id} renderItem={renderItem}
                    showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} />

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
    },

    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
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
    },

    message: {
        flex: 1,
        marginTop: 4,
        marginRight: 10,
        fontSize: 14,
        color: "#64748b",
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        overflow: "hidden",
    },
});