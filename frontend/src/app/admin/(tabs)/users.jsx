import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/appHeader";
import { getAlluser } from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../../redux/slices/usersSlice";

export default function UsersScreen() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.users || []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAlluser();
            if (res?.success) {
                dispatch(setUsers(res.users));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name) =>
        name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "?";

    return (
        <>
            <AppHeader title="Users" />

            <View style={styles.container}>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{users.length}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{users.filter((u) => u.isOnline).length}</Text>
                        <Text style={styles.statLabel}>Online Users</Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput placeholder="Search users..." value={search} onChangeText={setSearch} style={styles.searchInput} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#4facfe" />
                ) : (
                    <FlatList data={filteredUsers} keyExtractor={(item) => item._id} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                        <View style={styles.userCard}>
                            <View style={styles.leftSection}>

                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                                </View>

                                <View>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.email}>{item.email}</Text>
                                    <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2, }}>{item.role}</Text>
                                </View>
                            </View>

                            <View style={styles.rightSection}>
                                {item.isOnline ? (
                                    <Ionicons style={styles.statusDot} name="radio" size={20} color="#22c55e" />
                                ) : (
                                    <View style={[styles.statusDot, { backgroundColor: "#94a3b8" }]} />
                                )}

                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                        ListEmptyComponent={
                            <Text style={{ textAlign: "center", marginTop: 50, color: "#64748b" }}>No users found</Text>
                        } />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 16,
    },

    pageTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 20,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 18,
        marginHorizontal: 4,
        elevation: 3,
    },

    statNumber: {
        fontSize: 24,
        fontWeight: "800",
        color: "#4facfe",
    },

    statLabel: {
        marginTop: 4,
        color: "#64748b",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingHorizontal: 14,
        height: 55,
        marginBottom: 18,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },

    userCard: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 28,
        backgroundColor: "#7b5cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    email: {
        marginTop: 4,
        color: "#64748b",
        fontSize: 13,
    },

    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 14,
    },
});