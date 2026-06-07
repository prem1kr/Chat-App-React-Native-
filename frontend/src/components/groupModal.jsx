import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addMember, removeMember, updateGroup, deleteGroup } from "../hooks/useGroup";
import { useRouter } from "expo-router";
import LoadingButton from "./loadingButton";

export default function GroupModal({ visible, onClose, group, users = [], currentUserId, refreshGroup }) {
    const [groupName, setGroupName] = useState(group?.groupName || "");
    const isAdmin = group?.admin?._id === currentUserId;
    const router = useRouter();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleUpdateGroup = async () => {
        try {
            setUpdateLoading(true);
            const res = await updateGroup(group._id, { groupName });
            if (res?.success) {
                refreshGroup();
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdateLoading(false);
        }
    };


    const handleAddMember = async (memberId) => {
        const res = await addMember(group?._id, memberId);
        if (res?.success) {
            refreshGroup();
            onClose();
        }
    };

    const handleRemoveMember = async (memberId) => {
        const res = await removeMember(group?._id, memberId);
        console.log("REMOVE MEMBER RESPONSE:", res);
        if (res?.success) {
            refreshGroup();
            onClose();
        }
    };


    const handleDeleteGroup = async () => {
        try {
            setDeleteLoading(true);
            const res = await deleteGroup(group?._id);
            console.log("DELETE GROUP RESPONSE:", res);
            if (res?.success) {
                router.push('/users/home');
                refreshGroup();
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const availableUsers = Array.isArray(users)
        ? users.filter(
            (user) => !group?.members?.some((m) => m._id === user._id)
        ) : [];


    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.dragHandle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>Group Settings</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={22} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <FlatList showsVerticalScrollIndicator={false} ListHeaderComponent={
                        <>
                            {isAdmin && (
                                <>
                                    <Text style={styles.sectionTitle}>Edit Group</Text>
                                    <TextInput value={groupName} onChangeText={setGroupName} placeholder="Enter group name" style={styles.input} />
                                    <LoadingButton style={styles.primaryBtn} onPress={handleUpdateGroup} title="Save " loading={updateLoading} />

                                </>
                            )}

                            <Text style={styles.sectionTitle}>Members ({group?.members?.length || 0})</Text>
                        </>
                    } data={group?.members || []} keyExtractor={(item) => item._id} renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <View style={styles.memberLeft}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text style={styles.memberName}>{item.name}</Text>
                            </View>

                            {isAdmin &&
                                item._id !== currentUserId && (
                                    <TouchableOpacity onPress={() => handleRemoveMember(item._id)}>
                                        <Ionicons name="trash-outline" size={22} color="#ef4444" />
                                    </TouchableOpacity>
                                )}
                        </View>
                    )}
                        ListFooterComponent={
                            <>
                                {isAdmin && (
                                    <>
                                        <Text style={styles.sectionTitle}>Add Members</Text>

                                        {availableUsers.map((item) => (
                                            <TouchableOpacity key={item._id} style={styles.memberCard} onPress={() => handleAddMember(item._id)}>
                                                <View style={styles.memberLeft}>
                                                    <View style={[styles.avatar, { backgroundColor: "#4facfe" }]}>
                                                        <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
                                                    </View>
                                                    <Text style={styles.memberName}>{item.name}</Text>
                                                </View>
                                                <Ionicons name="person-add" size={22} color="#4facfe" />
                                            </TouchableOpacity>
                                        ))}

                                        <LoadingButton style={styles.deleteBtn} onPress={handleDeleteGroup} loading={deleteLoading} title={"Delete Group"} />

                                    </>
                                )}
                            </>
                        } />
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(15,23,42,0.55)",
        justifyContent: "flex-end",
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 12,
        maxHeight: "88%",
    },

    dragHandle: {
        width: 50,
        height: 5,
        backgroundColor: "#CBD5E1",
        borderRadius: 50,
        alignSelf: "center",
        marginBottom: 15,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#475569",
        marginTop: 20,
        marginBottom: 10,
    },

    input: {
        height: 55,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    primaryBtn: {
        marginTop: 12,
        backgroundColor: "#4facfe",
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },

    memberCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    memberLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    memberName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    deleteBtn: {
        marginTop: 20,
        backgroundColor: "#ef4444",
        height: 55,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
});