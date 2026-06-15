import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar, Image } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { socket } from "@/socket/socket";
import { getChatList } from "../../../hooks/useChat";
import { getUserGroups } from "../../../hooks/useGroup";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { addChat, removeChat, setChats, updateChat } from '../../../redux/slices/chatHomeSlice';
import { userInfo } from '../../../hooks/useAuth';
import { setUser } from '../../../redux/slices/userSlice'

export default function UserHome() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const chatsGroups = useSelector(state => state.chatHome.chatHome || []);
    const currentUser = useSelector(state => state.user.user || []);
    const currentUserId = currentUser?._id || currentUser?.id;

    const loadData = async () => {
        try {
            const [chatRes, groupRes] = await Promise.all([getChatList(), getUserGroups()]);
            const chats = chatRes?.chats?.map((chat) => ({ ...chat, type: "chat" })) || [];
            chats.forEach(chat => { socket.emit("joinChat", chat._id) });
            const groups = groupRes?.groups?.map((group) => ({ ...group, type: "group" })) || [];
            groups.forEach(group => { socket.emit("joinGroup", group._id) });
            dispatch(setChats([...chats, ...groups]));
        
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        const response = await userInfo();
        if (response?.success) {
            dispatch(setUser(response.user));
        }
    }

    useEffect(() => {
        loadData();
        fetchUser();
    }, []);


    useEffect(() => {
        const handleChatCreated = (data) => {
            dispatch(addChat(data.chat));
            dispatch(updateChat(data.chat));
        };

        const handleGroupCreated = (data) => {
            if (!data?._id) return;
            dispatch(addChat({ ...data, type: "group" }));
            dispatch(updateChat({ ...data, type: "group" }))
        };

        const handleGroupUpdated = (data) => {
            dispatch(updateChat({ ...data.group, type: "group" }));
        };

        const handleGroupDeleted = (data) => {
            dispatch(removeChat(data.groupId));
        };

        const handleNewMessage = (message) => {
            dispatch(updateChat({ _id: message.chatId, lastMessage: message.text, lastMessageTime: message.createdAt }));
        };

        const handleGroupMessage = (message) => {
            dispatch(updateChat({ _id: message.groupId, lastMessage: message.text, lastMessageTime: message.createdAt }));
        };

        const handleChatMessage = (message) => {
            dispatch(updateChat({ _id: message.chatId, lastMessage: message.text, lastMessageTime: message.createdAt }));
        };

        socket.on("chatCreated", handleChatCreated);
        socket.on("groupCreated", handleGroupCreated);
        socket.on("groupUpdated", handleGroupUpdated);
        socket.on("groupDeleted", handleGroupDeleted);
        socket.on("newMessage", handleNewMessage);
        socket.on("groupMessage", handleGroupMessage);

        return () => {
            socket.off("chatCreated", handleChatCreated);
            socket.off("groupCreated", handleGroupCreated);
            socket.off("groupUpdated", handleGroupUpdated);
            socket.off("groupDeleted", handleGroupDeleted);
            socket.off("newMessage", handleNewMessage);
            socket.off("groupMessage", handleGroupMessage);

        };
    }, [dispatch]);

    const getName = (item) => {
        if (item?.type === "group") {
            return item?.groupName;
        }
        const otherUser = item?.participants?.find(user => user?._id !== currentUserId);
        return otherUser?.name || "Unknown"
    };


    const getAvatar = (item) => {
        const name = getName(item) || "Unknown";
        return name.split(" ").map((n) => n?.[0] || "").join("").toUpperCase();
    };

    const formatTime = (time) => {
        if (!time) return "";
        const messageDate = new Date(time);
        const now = new Date();
        const diffMs = now - messageDate;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffHours < 24) {
            return messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        }
        if (diffDays < 7) {
            return messageDate.toLocaleDateString([], {
                weekday: "short",
            });
        }
        return messageDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
    };

    const filteredItems = chatsGroups.filter((item) => (getName(item) || "").toLowerCase().includes((search || "").toLowerCase()));

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
                    <Text style={styles.message} numberOfLines={1}>{item.lastMessage || "No messages yet"}</Text>

                    <View style={styles.rightSection}>
                        {item.type === "group" && (
                            <Ionicons name="people" size={16} color="#22c55e" style={{ marginRight: 6 }} />
                        )}

                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount > 99 ? "99+" : item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar backgroundColor="#4facfe" barStyle="light-content" />
            <AppHeader title="P-Chat" />

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
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    unreadBadge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
    },

    unreadText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
});
