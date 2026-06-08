import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { getAlluser } from "../../../hooks/useAuth";
import { createChat } from "../../../hooks/useChat";
import { createGroup } from "../../../hooks/useGroup";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../../redux/slices/usersSlice";
import { useRouter } from "expo-router";
import { socket } from "@/socket/socket";
import CreateGroupModal from "../../../components/createGroup";

export default function Contacts() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const Users = useSelector(state => state.users.users || []);
    const filteredUsers = Users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));
    const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase();

    const fetchAllUsers = async () => {
        const response = await getAlluser();
        if (response.success) {
            dispatch(setUsers(response.users));
        }
    };

    const openChat = async (user) => {
        try {
            const res = await createChat(user._id);
            if (res?.chat) {
                const chatId = res.chat._id;
                socket.emit("joinChat", chatId);
                router.push({
                    pathname: "/users/pages/chat",
                    params: { chatId }
                });
            }
        } catch (err) {
            console.log("Chat error:", err);
        }
    };

    const createGroupChat = async () => {
        try {
            if (!groupName.trim()) {
                return alert("Enter group name");
            }

            const data = {
                groupName,
                groupImage,
                members: selectedUsers,
            };

            const res = await createGroup(data);

            if (res?.group) {
                const groupId = res.group._id;
                socket.emit("joinGroup", groupId);
                setSelectedUsers([]);
                setGroupModalVisible(false);
                setGroupName("");
                setGroupImage("");
                router.push({
                    pathname: "/users/pages/group",
                    params: { groupId },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleUser = (item) => {
        const id = item._id;
        setSelectedUsers((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const handlePress = (item) => {
        if (selectedUsers.length > 0) {
            toggleUser(item);
        } else {
            openChat(item);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [dispatch]);

    const renderItem = ({ item }) => {
        const isSelected = selectedUsers.includes(item._id);

        return (
            <TouchableOpacity onLongPress={() => toggleUser(item)} onPress={() => handlePress(item)}
                style={[styles.userCard, isSelected && styles.selectedCard]}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}> {getInitials(item.name)} </Text>
                    {item.status === "Online" && (<View style={styles.onlineDot} />)}
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

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput placeholder="Search users..." placeholderTextColor="#94a3b8" value={search}
                        onChangeText={setSearch} style={styles.searchInput} />
                </View>

                {selectedUsers.length > 0 && (
                    <View style={styles.selectedBanner}>
                        <Text style={styles.selectedText}> {selectedUsers.length} Selected </Text>
                        <TouchableOpacity onPress={() => setSelectedUsers([])}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                <FlatList data={filteredUsers} keyExtractor={(item) => item._id} renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 120 }} />

                {selectedUsers.length >= 2 && (
                    <TouchableOpacity style={styles.createGroupBtn} onPress={() => setGroupModalVisible(true)}>
                        <Ionicons name="people" size={20} color="#fff" />
                        <Text style={styles.createGroupText}>  Create Group </Text>
                    </TouchableOpacity>
                )}

                <CreateGroupModal visible={groupModalVisible} onClose={() => setGroupModalVisible(false)} groupName={groupName}
                    setGroupName={setGroupName} groupImage={groupImage} setGroupImage={setGroupImage} onCreate={createGroupChat} />
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 15,
        textAlign: "center",
    },

    modalInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 12,
    },

    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: "center",
        marginBottom: 15,
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#ef4444",
        padding: 14,
        borderRadius: 12,
        marginRight: 8,
        alignItems: "center",
    },

    createBtn: {
        flex: 1,
        backgroundColor: "#4facfe",
        padding: 14,
        borderRadius: 12,
        marginLeft: 8,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
});