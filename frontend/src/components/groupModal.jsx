import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addMember, removeMember, updateGroup, deleteGroup } from "../hooks/useGroup";
import { useRouter } from "expo-router";

export default function GroupModal({ visible, onClose, group, users = [], currentUserId, refreshGroup }) {
    const [groupName, setGroupName] = useState(group?.groupName || "");
    const isAdmin = group?.admin?._id === currentUserId;
    const router = useRouter();

    const handleUpdateGroup = async () => {
        const res = await updateGroup(group._id, { groupName });
        if (res?.success) {
            refreshGroup();
            onClose();
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
        const res = await deleteGroup(group?._id);
            console.log("DELETE GROUP RESPONSE:", res);
        if (res?.success) {
            router.push('/users/home');
            refreshGroup();
            onClose();
        }
    };

    const availableUsers = Array.isArray(users)
        ? users.filter(
            (user) => !group?.members?.some((m) => m._id === user._id)
        ) : [];


    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Group Settings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} />
                        </TouchableOpacity>
                    </View>

                    {isAdmin && (
                        <>
                            <Text style={styles.sectionTitle}>Edit Group</Text>
                            <TextInput value={groupName} onChangeText={setGroupName} placeholder="Group Name" style={styles.input} />
                            <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdateGroup}>
                                <Text style={styles.btnText}>Save Changes</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <Text style={styles.sectionTitle}>Members</Text>
                    <FlatList data={group?.members || []} keyExtractor={(item) => item._id} renderItem={({ item }) => (
                        <View style={styles.memberRow}>
                            <Text>{item.name}</Text>
                            {isAdmin && item._id !== currentUserId && (
                                <TouchableOpacity onPress={() => handleRemoveMember(item._id)}>
                                    <Ionicons name="trash" size={20} color="red" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )} />

                    {isAdmin && (
                        <>
                            <Text style={styles.sectionTitle}>Add Members</Text>
                            <FlatList data={availableUsers} keyExtractor={(item) => item._id} renderItem={({ item }) => (
                                <TouchableOpacity style={styles.memberRow} onPress={() => handleAddMember(item._id)}>
                                    <Text>{item.name}</Text>
                                    <Ionicons name="person-add" size={20} color="#4facfe" />
                                </TouchableOpacity>
                            )} />
                        </>
                    )}

                    {isAdmin && (
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteGroup}>
                            <Ionicons name="trash" size={20} color="#fff" />
                            <Text style={styles.btnText}>Delete Group</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },

    container: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        maxHeight: "90%",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
    },

    sectionTitle: {
        marginTop: 15,
        marginBottom: 8,
        fontWeight: "700",
        fontSize: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
    },

    memberRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor:
            "#f1f5f9",
    },

    primaryBtn: {
        backgroundColor: "#4facfe",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },

    deleteBtn: {
        backgroundColor: "#ef4444",
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
});