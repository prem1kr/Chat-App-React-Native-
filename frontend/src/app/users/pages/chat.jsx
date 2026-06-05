import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import AppHeader from "../../../components/appHeader";
import { useLocalSearchParams } from "expo-router";

const Chat = () => {
    const { userId, name } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const router = useRouter();
    const user = useSelector((state) => state.user.user || {});
    const userName = user?.name;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // SEND MESSAGE (LOCAL ONLY)
    const sendMessage = () => {
        if (!message.trim()) return;

        const msgData = {
            id: Date.now().toString(),
            text: message,
            sender: userName,
            ts: Date.now(),
        };

        setMessages((prev) => [...prev, msgData]);
        setMessage("");

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.sender === userName;

        return (
            <View style={[styles.messageWrapper, isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                <Text style={styles.senderName}> {isMyMessage ? "You" : item.sender} </Text>

                <View style={[styles.messageContainer, isMyMessage ? styles.sent : styles.received]}>
                    <Text style={[styles.messageText, isMyMessage && { color: "#fff" }]} >{item.text}</Text>
                </View>

                <Text style={styles.timeText}> {new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title={name || "chat"}  >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </AppHeader>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} />

                <View style={styles.inputContainer}>
                    <TextInput placeholder="Type a message..." placeholderTextColor="#9CA3AF" value={message} onChangeText={setMessage} style={styles.input} />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    header: {
        height: 70,
        backgroundColor: '#4ec28d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    headerTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: '700',
    },

    chatContainer: {
        paddingHorizontal: 14,
        paddingVertical: 18,
        paddingBottom: 100,
    },

    messageWrapper: {
        marginBottom: 18,
    },

    myMessageWrapper: {
        alignItems: 'flex-end',
    },

    otherMessageWrapper: {
        alignItems: 'flex-start',
    },

    senderName: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 5,
        marginHorizontal: 4,
        fontWeight: '600',
    },

    messageContainer: {
        maxWidth: '78%',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 18,
    },

    sent: {
        backgroundColor: '#4ec28d',
        borderBottomRightRadius: 4,
    },

    received: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    messageText: {
        fontSize: 15,
        color: '#111827',
        lineHeight: 22,
    },

    timeText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 5,
        marginHorizontal: 6,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },

    input: {
        flex: 1,
        height: 52,
        backgroundColor: '#F3F4F6',
        borderRadius: 30,
        paddingHorizontal: 18,
        fontSize: 15,
        color: '#111827',
        marginRight: 10,
    },

    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4ec28d',
        justifyContent: 'center',
        alignItems: 'center',
    },

});