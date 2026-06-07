import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { getAllChats } from "../../../hooks/useChat";

export default function Chats() {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await getAllChats();
            if (response?.success) {
                setChats(response.chats || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter((chat) =>
        chat?.participants?.some((p) =>
            p.name?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const getAvatar = (name) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const getChatName = (item) => {
        // assuming 1-to-1 chat
        return item.participants?.[0]?.name || "Unknown";
    };

    const renderItem = ({ item }) => {
        const user = item.participants?.[0];

        return (
            <TouchableOpacity style={styles.chatCard}>
                <View style={styles.left}>
                    {user?.profilePic ? (
                        <Image
                            source={{ uri: user.profilePic }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {getAvatar(user?.name)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {user?.name || "Unknown User"}
                        </Text>

                        <Text style={styles.lastMessage}>
                            {item.lastMessage || "No messages yet"}
                        </Text>
                    </View>
                </View>

                <View style={styles.right}>
                    {user?.isOnline && (
                        <View style={styles.onlineDot} />
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <AppHeader title="Chats" />

            <View style={styles.container}>
                <View style={styles.headerCard}>
                    <Text style={styles.title}>Your Chats</Text>
                    <Text style={styles.subtitle}>
                        Total Chats: {chats.length}
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Search users..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.input}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#4facfe" />
                ) : (
                    <FlatList
                        data={filteredChats}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7ff",
        padding: 15,
    },

    headerCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 22,
        marginBottom: 15,
        elevation: 4,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        color: "#64748b",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 52,
        marginBottom: 15,
        elevation: 2,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },

    chatCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 3,
    },

    left: {
        flexDirection: "row",
        flex: 1,
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    info: {
        flex: 1,
        justifyContent: "center",
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    lastMessage: {
        color: "#94a3b8",
        marginTop: 4,
        fontSize: 13,
    },

    right: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#22c55e",
        marginRight: 8,
    },
});