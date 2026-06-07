import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, ActivityIndicator, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { getAllGroups } from "../../../hooks/useGroup";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await getAllGroups();
            if (response?.success) {
                setGroups(response.groups || []);
                console.log(response.groups)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = groups.filter((group) => group.groupName?.toLowerCase().includes(search.toLowerCase()));
    const getAvatar = (name) => { return name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase(); };

    const renderItem = ({ item }) => (
        <View style={styles.groupCard}>
            <View style={styles.left}>
                {item.groupImage ? (
                    <Image source={{ uri: item.groupImage }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getAvatar(item.groupName)}</Text>
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={styles.groupName}>{item.groupName}</Text>
                    <Text style={styles.groupMeta}>{item.members?.length || 0} Members</Text>
                    <Text style={styles.lastActivity}>Admin: {item.admin?.name}</Text>
                    <Text style={styles.lastActivity}>{item.lastMessage || "No messages yet"}</Text>
                </View>
            </View>

            <Ionicons name="people" size={22} color="#22c55e" />
        </View>
    );

    return (
        <>
            <AppHeader title="Groups" />

            <View style={styles.container}>
                <View style={styles.headerCard}>
                    <Text style={styles.title}>Group Management</Text>
                    <Text style={styles.subtitle}>Total Groups: {groups.length}
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput placeholder="Search groups..." value={search} onChangeText={setSearch} style={styles.input} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#4facfe" />
                ) : (
                    <FlatList data={filteredGroups} keyExtractor={(item) => item._id} renderItem={renderItem} showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120, }} />
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

    groupCard: {
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
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#22c55e",
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

    groupName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    groupMeta: {
        color: "#64748b",
        marginTop: 2,
    },

    lastActivity: {
        color: "#94a3b8",
        marginTop: 2,
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBtn: {
        marginLeft: 10,
        padding: 6,
    },
});