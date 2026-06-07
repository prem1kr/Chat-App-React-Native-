import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { socket } from "@/socket/socket";
import { getChatList } from "../../../hooks/useChat";
import { useRouter } from "expo-router";

export default function UserHome() {
    const router = useRouter();

    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");

    /* ---------------- LOAD CHATS ---------------- */
    const loadChats = async () => {
        const res = await getChatList();
        if (res?.chats) setChats(res.chats);
    };

    /* ---------------- FORMAT TIME ---------------- */
    const formatTime = (time) => {
        if (!time) return "";
        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /* ---------------- GET CHAT NAME ---------------- */
    const getChatName = (chat) => {
        const user = chat?.participants?.[0];
        return user?.name || "Unknown";
    };

    const getChatAvatar = (chat) => {
        const name = getChatName(chat);
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    /* ---------------- SOCKET HANDLERS ---------------- */
    useEffect(() => {
        loadChats();

        const onChatCreated = (payload) => {
            setChats((prev) => [payload.chat, ...prev]);
        };

        const onNewMessage = (message) => {
            setChats((prev) =>
                prev.map((chat) =>
                    chat._id === message.chatId
                        ? {
                            ...chat,
                            lastMessage: message.text,
                            lastMessageTime: message.createdAt,
                        }
                        : chat
                )
            );
        };

        socket.on("chatCreated", onChatCreated);
        socket.on("newMessage", onNewMessage);

        return () => {
            socket.off("chatCreated", onChatCreated);
            socket.off("newMessage", onNewMessage);
        };
    }, []);

    /* ---------------- SEARCH FILTER ---------------- */
    const filteredChats = chats.filter((item) => {
        const name = getChatName(item).toLowerCase();
        return name.includes(search.toLowerCase());
    });

    /* ---------------- CHAT OPEN ---------------- */
    const openChat = useCallback(
        (chatId) => {
            router.push(`/users/pages/chat/${chatId}`);
        },
        [router]
    );

    /* ---------------- RENDER ITEM ---------------- */
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatCard}
            activeOpacity={0.85}
            onPress={() => openChat(item._id)}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getChatAvatar(item)}</Text>
                <View style={styles.onlineDot} />
            </View>

            <View style={styles.chatInfo}>
                <View style={styles.row}>
                    <Text style={styles.name}>{getChatName(item)}</Text>
                    <Text style={styles.time}>
                        {formatTime(item.lastMessageTime)}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.message} numberOfLines={1}>
                        {item.lastMessage || "No messages yet"}
                    </Text>

                    {!!item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar backgroundColor="#4facfe" barStyle="light-content" />
            <AppHeader />

            <View style={styles.container}>
                {/* SEARCH */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Search chats..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>

                {/* CHAT LIST */}
                <FlatList
                    data={filteredChats}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
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
        shadowOffset: { width: 0, height: 3 },
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