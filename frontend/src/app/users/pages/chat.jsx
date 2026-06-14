import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "../../../components/appHeader";
import { socket } from "@/socket/socket";
import { getChatMessages, sendMessage, markAsDelivered, markAsRead, deleteMessage as deleteMessageApi } from "../../../hooks/useMessage";
import MembersModal from "../../../components/memebersModal";
import { addMessage, deleteMessage, setChatMessages, updateMessage } from '../../../redux/slices/chatMessages';
import { updateChat } from "../../../redux/slices/chatHomeSlice";

const Chat = () => {
    const dispatch = useDispatch();
    const { chatId, name } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const router = useRouter();
    const user = useSelector((state) => state.user.user || {});
    const userId = user?._id;
    const userName = user?.name;
    const [message, setMessage] = useState("");
    const messages = useSelector(state => state.chatMessages.messages || []);

    const loadMessages = async () => {
        const res = await getChatMessages(chatId);

        if (res?.messages) {
            dispatch(setChatMessages(res.messages));
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
        const messageText = message.trim();
        const tempMsg = {
            _id: Date.now().toString(),
            text: messageText,
            sender: { _id: userId, name: userName },
            chatId,
            createdAt: new Date().toISOString(),
            deliveredTo: [],
            readBy: [],
            isTemp: true,
        };

        dispatch(addMessage(tempMsg));
        dispatch(updateChat({ _id: chatId, lastMessage: messageText, lastMessageTime: tempMsg.createdAt }));
        setMessage("");
        await sendMessage({ chatId, text: messageText, messageType: "text" });

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };


    const handleDeleteMessage = (messageId) => {
        Alert.alert("Delete Message", "Do you want to delete this message?",
            [
                { text: "Cancel", style: "cancel" }, {
                    text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            dispatch(deleteMessage(messageId));
                            await deleteMessageApi(messageId);
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        loadMessages();
        socket.emit("joinChat", chatId);
<<<<<<< HEAD

=======
        
>>>>>>> c3e1c2dd283d0fc06937394f7d23711c2ea55c69
        socket.on("newMessage", (msg) => {
            if (msg.chatId === chatId) {
                dispatch(addMessage(msg));
                dispatch(updateMessage({ _id: msg._id, ...msg }));
            }
        });

        socket.on("messageDeleted", (data) => {
            dispatch(deleteMessage(data.messageId));
            if (data.chatId) {
                dispatch(updateChat({ _id: data.chatId, lastMessage: data.lastMessage, lastMessageTime: data.lastMessageTime }));
            }
        });

        socket.on("messageDelivered", ({ messageId, userId: uid }) => {
<<<<<<< HEAD
            dispatch(updateMessage({ _id: messageId, deliveredTo: [uid] }));
        });

        socket.on("messageRead", ({ messageId, userId: uid }) => {
            dispatch(updateMessage({ _id: messageId, readBy: [uid] }));
=======
            dispatch(updateMessage({_id: messageId,deliveredTo: [uid]}));
        });

        socket.on("messageRead", ({ messageId, userId: uid }) => {
            dispatch(updateMessage({_id: messageId,readBy: [uid]}));
>>>>>>> c3e1c2dd283d0fc06937394f7d23711c2ea55c69
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
        const readBy = Array.isArray(item.readBy) ? item.readBy : [];
        const deliveredTo = Array.isArray(item.deliveredTo) ? item.deliveredTo : [];
        const isRead = readBy.length > 0 && readBy.some(id => id !== userId);
        const isDelivered = Array.isArray(item.deliveredTo) && item.deliveredTo.length > 0 && item.deliveredTo.some(id => id !== userId);

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
                <TouchableOpacity activeOpacity={0.8} onLongPress={() => { if (isMyMessage && !item.isTemp) { handleDeleteMessage(item._id); } }}
                    style={[styles.messageContainer, isMyMessage ? styles.sent : styles.received]}>
                    <Text style={[styles.messageText, isMyMessage && { color: "#fff" }]}> {item.text} </Text>
                </TouchableOpacity>

                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                    {renderMessageStatus(item)}
                </View>
            </View >
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
