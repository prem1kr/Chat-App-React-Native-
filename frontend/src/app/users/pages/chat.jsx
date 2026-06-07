import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import AppHeader from "../../../components/appHeader";
import { socket } from "@/socket/socket";
import { getChatMessages, sendMessage, markAsDelivered, markAsRead } from "../../../hooks/useMessage";
import MembersModal from "../../../components/memebersModal";

const Chat = () => {
    const { chatId, name } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const router = useRouter();
    const user = useSelector((state) => state.user.user || {});
    const userId = user?._id;
    const userName = user?.name;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const loadMessages = async () => {
        const res = await getChatMessages(chatId);

        if (res?.messages) {
            setMessages(res.messages);
            for (const msg of res.messages) {
                if (
                    msg.sender?._id !== userId && !msg.deliveredTo?.includes(userId)
                ) {
                    await markAsDelivered(msg._id);
                }
            }
        }
    };

    const send = async () => {
        if (!message.trim()) return;

        const tempMsg = {
            _id: Date.now().toString(),
            text: message,
            sender: { _id: userId, name: userName },
            createdAt: new Date(),
            deliveredTo: [],
            readBy: [],
        };

        setMessages((prev) => [...prev, tempMsg]);
        setMessage("");

        await sendMessage({
            chatId,
            text: message,
            messageType: "text",
        });

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        loadMessages();
        socket.emit("joinChat", chatId);

        socket.on("newMessage", async (msg) => {
            if (msg.chatId === chatId) {
                setMessages((prev) => [...prev, msg]);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);

                if (msg.sender?._id !== userId) {
                    await markAsDelivered(msg._id);
                }
            }
        });

        socket.on("messageDeleted", ({ messageId }) => {
            setMessages((prev) =>
                prev.filter((msg) => msg._id !== messageId)
            );
        });

        socket.on("messageDelivered", ({ messageId, userId }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId ? {
                        ...msg, deliveredTo: [...new Set([...(msg.deliveredTo || []), userId]),
                        ],
                    } : msg
                )
            );
        });

        socket.on("messageRead", ({ messageId, userId }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId ? {
                        ...msg, readBy: [...new Set([...(msg.readBy || []), userId]),
                        ],
                    } : msg
                )
            );
        });

        return () => {
            socket.off("newMessage");
            socket.off("messageDeleted");
            socket.off("messageDelivered");
            socket.off("messageRead");
        };
    }, [chatId, userId]);

    useEffect(() => {
        if (!messages.length) return;

        const markMessagesRead = async () => {
            for (const msg of messages) {
                if (
                    msg.sender?._id !== userId &&
                    !msg.readBy?.includes(userId)
                ) {
                    await markAsRead(msg._id);
                }
            }
        };

        markMessagesRead();
    }, [messages, userId]);


    const renderMessageStatus = (item) => {
        if (item.sender?._id !== userId) return null;
        const isRead = item.readBy?.length > 0 && item.readBy.some((id) => id !== userId);
        const isDelivered = item.deliveredTo?.length > 0 && item.deliveredTo.some((id) => id !== userId);
        if (isRead) {
            return (<Ionicons name="checkmark-done" size={16} color="#3b82f6" />);
        }
        if (isDelivered) {
            return (<Ionicons name="checkmark-done" size={16} color="#9CA3AF" />);
        }
        return (<Ionicons name="checkmark" size={16} color="#9CA3AF" />);
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.sender?._id === userId;
        return (
            <View style={[styles.messageWrapper, isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                <Text style={styles.senderName}>  {isMyMessage ? "You" : item.sender?.name}</Text>

                <View style={[styles.messageContainer, isMyMessage ? styles.sent : styles.received]}>
                    <Text style={[styles.messageText, isMyMessage && { color: "#fff" }]}> {item.text} </Text>
                </View>

                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>
                        {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>

                    {renderMessageStatus(item)}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title={name || "Chat"} >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </AppHeader>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item._id} renderItem={renderItem}
                    contentContainerStyle={styles.chatContainer} onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} />

                <View style={styles.inputContainer}>
                    <TextInput placeholder="Type a message..." value={message} onChangeText={setMessage} style={styles.input} />
                    <TouchableOpacity style={styles.sendButton} onPress={send}>
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
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 5,
        marginHorizontal: 6,
    },

    timeText: {
        fontSize: 11,
        color: "#9CA3AF",
    },

});