import React from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MembersModal({ visible, onClose, members = [] }) {
    return (
        <Modal visible={visible} animationType="slide" transparentonRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Members</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <FlatList data={members} keyExtractor={(item) => item._id} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                        <View style={styles.memberRow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}</Text>
                            </View>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    )} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "70%",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22,
        backgroundColor: "#4facfe",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
    },

    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
});