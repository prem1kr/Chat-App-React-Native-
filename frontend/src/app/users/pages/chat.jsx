import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

const Chat = () => {

    const socket = useRef(null);
    const flatListRef = useRef(null);
    const router = useRouter();
    const user = useSelector(state => state.user.user || {});
    const userName = user?.name;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    // SOCKET CONNECTION
    useEffect(() => {
        socket.current = connectWs();
        socket.current.on('connect', () => {
            socket.current.emit('joinRoom', userName);
        });

        // RECEIVE MESSAGE
        socket.current.on('chatMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
            dispatch(setChatuser(msg.sender));
        });

        // ROOM NOTICE
        socket.current.on('RoomNotice', (data) => {
            console.log(data);
        });

        return () => {
            socket.current.disconnect();
        };

    }, []);

    // SEND MESSAGE
    const sendMessage = () => {

        if (!message.trim()) return;
        const msgData = {
            id: Date.now().toString(),
            text: message,
            sender: userName,
            ts: Date.now(),
        };

        // LOCAL UI UPDATE
        setMessages(prev => [...prev, msgData]);
        // SOCKET SEND
        socket.current.emit('chatMessage', msgData);
        setMessage("");
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const removeSender = async () => {
        await dispatch(removeChatuser());
        await router.back();
    }

    const renderItem = ({ item }) => {
        const isMyMessage = item.sender === userName;
        return (

            <View style={[styles.messageWrapper, isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                <Text style={styles.senderName}> {isMyMessage ? 'You' : item.sender}</Text>

                <View style={[styles.messageContainer, isMyMessage ? styles.sent : styles.received]}>
                    <Text style={[styles.messageText, isMyMessage && { color: '#fff' }]}>{item.text} </Text>
                </View>

                <Text style={styles.timeText}>
                    {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>

            </View>
        );
    };


    return (

        <View style={styles.container} >

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}> {senderName || 'Chat Support'} </Text>

                <TouchableOpacity onPress={removeSender}>
                    <Ionicons name="exit-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>

                {/* CHAT LIST */}
                <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item.id} renderItem={renderItem}
                    contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled" />

                {/* INPUT */}
                <View style={styles.inputContainer}>
                    <TextInput placeholder="Type a message..." placeholderTextColor="#9CA3AF" value={message} onChangeText={setMessage} style={styles.input} />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage} >
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