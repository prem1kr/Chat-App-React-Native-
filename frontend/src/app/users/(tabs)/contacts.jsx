import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { getAlluser } from "../../../hooks/useAuth";
import { createChat } from "../../../hooks/useChat";
import { createGroup } from "../../../hooks/useGroup";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../../redux/slices/usersSlice";
import { useRouter } from "expo-router";
import { socket } from "@/socket/socket";

export default function Contacts() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const Users = useSelector(state => state.users.users || []);
    const filteredUsers = Users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );
    const getInitials = (name = "") =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        const response = await getAlluser();
        if (response.success) {
            dispatch(setUsers(response.users));
        }
    };

    // =========================
    // INDIVIDUAL CHAT
    // =========================
    const openChat = async (user) => {
        try {
            const res = await createChat(user._id);
            if (res?.chat) {
                const chatId = res.chat._id;
                socket.emit("joinChat", chatId);
                router.push(`/users/pages/chat/${chatId}`);
            }
        } catch (err) {
            console.log("Chat error:", err);
        }
    };

    // =========================
    // GROUP CHAT CREATE
    // =========================
    const createGroupChat = async () => {
        try {
            const data = {groupName: "New Group",members: selectedUsers};
            const res = await createGroup(data);
            if (res?.group) {
                const groupId = res.group._id;
                socket.emit("joinGroup", groupId);
                setSelectedUsers([]);
                router.push(`/users/pages/group/${groupId}`);
            }
        } catch (err) {
            console.log("Group error:", err);
        }
    };

    // =========================
    // SELECT LOGIC
    // =========================
    const toggleUser = (item) => {
        const id = item._id;

        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const handlePress = (item) => {
        if (selectedUsers.length > 0) {
            toggleUser(item);
        } else {
            openChat(item);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedUsers.includes(item._id);

        return (
            <TouchableOpacity
                onLongPress={() => toggleUser(item)}
                onPress={() => handlePress(item)}
                style={[styles.userCard, isSelected && styles.selectedCard]}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {getInitials(item.name)}
                    </Text>
                    {item.status === "Online" && (
                        <View style={styles.onlineDot} />
                    )}
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                </View>

                {selectedUsers.length > 0 ? (
                    isSelected ? (
                        <View style={styles.selectedIcon}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        </View>
                    ) : (
                        <View style={styles.unselectedIcon}>
                            <Ionicons name="ellipse-outline" size={22} color="#94a3b8" />
                        </View>
                    )
                ) : (
                    <View style={styles.chatBtn}>
                        <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <AppHeader title="Contacts" />

            <View style={styles.container}>

                {/* SEARCH */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Search users..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>

                {/* SELECTED BANNER */}
                {selectedUsers.length > 0 && (
                    <View style={styles.selectedBanner}>
                        <Text style={styles.selectedText}>
                            {selectedUsers.length} Selected
                        </Text>

                        <TouchableOpacity onPress={() => setSelectedUsers([])}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* USERS */}
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />

                {/* CREATE GROUP BUTTON */}
                {selectedUsers.length >= 2 && (
                    <TouchableOpacity
                        style={styles.createGroupBtn}
                        onPress={createGroupChat}
                    >
                        <Ionicons name="people" size={20} color="#fff" />
                        <Text style={styles.createGroupText}>
                            Create Group
                        </Text>
                    </TouchableOpacity>
                )}
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

    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 14,
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#eef2ff",
        elevation: 3,
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

    avatarText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
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

    userInfo: {
        flex: 1,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    status: {
        marginTop: 3,
        color: "#64748b",
        fontSize: 13,
    },

    chatBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedCard: {
        borderColor: "#4facfe",
        borderWidth: 2,
    },

    selectedIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
    },

    unselectedIcon: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },

    selectedBanner: {
        backgroundColor: "#4facfe",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    selectedText: {
        color: "#fff",
        fontWeight: "700",
    },

    createGroupBtn: {
        position: "absolute",
        bottom: 100,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#7b5cff",
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 8,
    },

    createGroupText: {
        color: "#fff",
        fontWeight: "700",
        marginLeft: 8,
    },
});