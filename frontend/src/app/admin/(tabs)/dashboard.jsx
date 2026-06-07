import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "../../../components/appHeader";
import { getAlluser, userInfo } from "../../../hooks/useAuth";
import { getChatList } from "../../../hooks/useChat";
import { getUserGroups } from "../../../hooks/useGroup";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [stats, setStats] = useState({
        users: 0,
        chats: 0,
        groups: 0,
        onlineUsers: 0,
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentGroups, setRecentGroups] = useState([]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [userRes, usersRes, chatsRes, groupsRes,] = await Promise.all([userInfo(), getAlluser(), getChatList(), getUserGroups(),]);
            const users = usersRes?.users || [];
            const chats = chatsRes?.chats || [];
            const groups = groupsRes?.groups || [];
            console.log(users);
            console.log(chats);
            console.log(groups);
            setCurrentUser(userRes?.user);

            setStats({
                users: users.length,
                chats: chats.length,
                groups: groups.length,
                onlineUsers: users.filter(
                    (user) => user.isOnline
                ).length,
            });

            setRecentUsers(users.slice(0, 5));
            setRecentGroups(groups.slice(0, 5));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <>
            <AppHeader title="Dashboard" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                <LinearGradient colors={["#4facfe", "#7b5cff"]} style={styles.header}>
                    <Text style={styles.welcome}>Welcome Back 👋</Text>
                    <Text style={styles.adminName}>{currentUser?.name || "Admin"}</Text>

                    <View style={styles.headerStats}>
                        <View style={styles.smallCard}>
                            <Text style={styles.smallNumber}>{stats.users}</Text>
                            <Text style={styles.smallLabel}>Users</Text>
                        </View>

                        <View style={styles.smallCard}>
                            <Text style={styles.smallNumber}>{stats.groups}</Text>
                            <Text style={styles.smallLabel}>Groups</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="people" size={28} color="#4facfe" />
                        <Text style={styles.statNumber}>{stats.users}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="chatbubbles" size={28} color="#22c55e" />
                        <Text style={styles.statNumber}>{stats.chats}</Text>
                        <Text style={styles.statLabel}>Total Chats</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="people-circle" size={28} color="#f59e0b" />
                        <Text style={styles.statNumber}>{stats.groups}</Text>
                        <Text style={styles.statLabel}>Total Groups</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="radio" size={28} color="#ef4444" />
                        <Text style={styles.statNumber}>{stats.onlineUsers}</Text>
                        <Text style={styles.statLabel}>Online Users</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="person-add" size={28} color="#4facfe" />
                        <Text style={styles.actionText}>Add User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="people" size={28} color="#22c55e" />
                        <Text style={styles.actionText}>Manage Users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="chatbox" size={28} color="#f59e0b" />
                        <Text style={styles.actionText}>Groups</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="settings" size={28} color="#7b5cff" />
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Recent Users</Text>

                {recentUsers.map((user) => (
                    <View key={user._id} style={styles.userCard}>
                        <View style={styles.userLeft}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase()}</Text>
                            </View>

                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                            </View>
                        </View>

                        <Ionicons name={user.isOnline ? "radio" : "ellipse-outline"} size={16} color={user.isOnline ? "#22c55e" : "#94a3b8"} />
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Recent Groups</Text>
                {recentGroups.map((group) => (
                    <View key={group._id} style={styles.groupCard}>
                        <View style={styles.groupIcon}>
                            <Ionicons name="people-circle" size={28} color="#7b5cff" />
                        </View>

                        <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>{group.groupName}</Text>
                            <Text style={styles.groupMembers}>{group.members?.length || 0} Members</Text>
                        </View>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>System Status</Text>
                <View style={styles.statusCard}>
                    <Text style={styles.statusTitle}>Socket Server</Text>
                    <Text style={styles.statusValue}>Online</Text>
                </View>

                <View style={styles.statusCard}>
                    <Text style={styles.statusTitle}>API Server</Text>
                    <Text style={styles.statusValue}>Connected</Text>
                </View>

                <View style={styles.statusCard}>
                    <Text style={styles.statusTitle}>Database</Text>
                    <Text style={styles.statusValue}>Active</Text>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingTop: 5,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
    },

    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 15,
        fontWeight: "500",
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginHorizontal: 10,
    },

    welcome: {
        color: "#fff",
        fontSize: 15,
        opacity: 0.9,
    },

    adminName: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginTop: 5,
    },

    headerStats: {
        flexDirection: "row",
        marginTop: 20,
        gap: 12,
    },

    smallCard: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.18)",
        padding: 16,
        borderRadius: 18,
    },

    smallNumber: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
    },

    smallLabel: {
        color: "#fff",
        marginTop: 4,
        opacity: 0.9,
    },

    statsContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginTop: 15,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        marginHorizontal: 5,
        borderRadius: 22,
        paddingVertical: 22,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 4,
    },

    statNumber: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
        marginTop: 10,
    },

    statLabel: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 5,
        fontWeight: "500",
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#111827",
        marginTop: 25,
        marginBottom: 12,
        marginHorizontal: 15,
    },

    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },

    actionCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 22,
        paddingVertical: 24,
        alignItems: "center",
        marginBottom: 12,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,

        elevation: 3,
    },

    actionText: {
        marginTop: 10,
        color: "#111827",
        fontSize: 14,
        fontWeight: "700",
    },

    userCard: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        marginBottom: 10,
        borderRadius: 20,
        padding: 14,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,

        elevation: 2,
    },

    userLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 18,
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },

    userEmail: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 3,
    },

    groupCard: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        marginBottom: 10,
        borderRadius: 20,
        padding: 14,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,

        elevation: 2,
    },

    groupIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    groupInfo: {
        flex: 1,
    },

    groupName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },

    groupMembers: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 3,
    },

    statusCard: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        marginBottom: 10,
        borderRadius: 18,
        padding: 15,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,

        elevation: 2,
    },

    statusTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },

    statusValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#22C55E",
    },

    bottomSpace: {
        height: 120,
    },
});