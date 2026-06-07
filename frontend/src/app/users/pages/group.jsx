import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getGroupById, addMember, removeMember, updateGroup, deleteGroup } from "@/hooks/useGroup";
import { getGroupMessages, sendMessage, } from "@/hooks/useMessage";
import { socket } from "@/socket/socket";
import AppHeader from "../../../components/appHeader";
import { Ionicons } from "@expo/vector-icons";
import GroupModal from "../../../components/groupModal";
import { getAlluser } from "../../../hooks/useAuth";

export default function GroupScreen() {
  const { groupId } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const flatListRef = useRef(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchAllUsers = async () => {
    const response = await getAlluser();
    if (response.success) {
      setUsers(response.users);
    }
  }

  const initialize = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
    const groupRes = await getGroupById(groupId);
    const msgRes = await getGroupMessages(groupId);

    if (groupRes?.group) {
      setGroup(groupRes.group);
    }

    if (msgRes?.messages) {
      setMessages(msgRes.messages);
    }
  };

  useEffect(() => {
    socket.emit("joinGroup", groupId);
    socket.on("groupMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("groupUpdated", (updatedGroup) => {
      if (updatedGroup._id === groupId) {
        setGroup(updatedGroup);
      }
    });

    socket.on("groupDeleted", (deletedId) => {
      if (deletedId === groupId) {
        Alert.alert("Group Deleted");
      }
    });

    return () => {
      socket.off("groupMessage");
      socket.off("groupUpdated");
      socket.off("groupDeleted");
    };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ groupId, text, messageType: "text", });
    setText("");
  };

  useEffect(() => {
    initialize();
    fetchAllUsers();
  }, []);

  const isAdmin = group?.admin?._id === userId;

  const renderMessage = ({ item }) => {
    const isMine = item.sender?._id === userId;
    return (
      <View style={[styles.messageWrapper, isMine ? styles.myMessageWrapper : styles.otherMessageWrapper,]}>
        <Text style={styles.senderName}> {isMine ? "You" : item.sender?.name}  </Text>

        <View style={[styles.messageContainer, isMine ? styles.sent : styles.received]}>
          <Text style={[styles.messageText, isMine && { color: "#fff" }]}> {item.text}</Text>
        </View>

        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title={group?.groupName || "Group Chat"}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </AppHeader>

      <View style={styles.groupCard}>

        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}> {group?.groupName?.charAt(0)} </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.groupName}> {group?.groupName}</Text>
          <Text style={styles.memberCount}> {group?.members?.length} Members </Text>
        </View>

        {isAdmin && (
          <TouchableOpacity onPress={() => setShowGroupModal(true)}>
            <Ionicons name="ellipsis-vertical" size={22} color="#6B7280" />
          </TouchableOpacity>
        )}

      </View>

      <FlatList horizontal showsHorizontalScrollIndicator={false} data={group?.members || []} keyExtractor={(item) => item._id}
        contentContainerStyle={styles.membersContainer} renderItem={({ item }) => (
          <TouchableOpacity style={styles.memberCard} onLongPress={() => {
            if (
              isAdmin && item._id !== userId
            ) {
              handleRemoveMember(item._id);
            }
          }}>

            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}> {item.name?.charAt(0)} </Text>
            </View>

            <Text numberOfLines={1} style={styles.memberName}> {item.name} </Text>
          </TouchableOpacity>
        )} />


      <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item._id} renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer} onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} />

      <View style={styles.inputContainer}>
        <TextInput placeholder="Type a message..." value={text} onChangeText={setText} style={styles.input} />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {group && (
        <GroupModal visible={showGroupModal} onClose={() => setShowGroupModal(false)} group={group} users={users} currentUserId={userId} refreshGroup={initialize} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  groupName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    padding: 10,
  },

  button: {
    backgroundColor: "#eee",
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },

  member: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    margin: 5,
    borderRadius: 20,
  },

  message: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },

  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },

  otherMessage: {
    backgroundColor: "#F1F1F1",
    alignSelf: "flex-start",
  },

  sender: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
  },

  sendBtn: {
    backgroundColor: "#4facfe",
    marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 18,
    elevation: 2,
  },

  groupAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#4ec28d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  groupAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  groupName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  memberCount: {
    color: "#6B7280",
    marginTop: 3,
  },

  membersContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  memberCard: {
    alignItems: "center",
    marginRight: 14,
  },

  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4facfe",
    justifyContent: "center",
    alignItems: "center",
  },

  memberAvatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  memberName: {
    marginTop: 6,
    width: 70,
    textAlign: "center",
    fontSize: 12,
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
    alignItems: "flex-end",
  },

  otherMessageWrapper: {
    alignItems: "flex-start",
  },

  senderName: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
    marginHorizontal: 4,
    fontWeight: "600",
  },

  messageContainer: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },

  sent: {
    backgroundColor: "#4ec28d",
    borderBottomRightRadius: 4,
  },

  received: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    elevation: 2,
  },

  messageText: {
    fontSize: 15,
    color: "#111827",
  },

  timeText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    height: 52,
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    paddingHorizontal: 18,
    marginRight: 10,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4ec28d",
    justifyContent: "center",
    alignItems: "center",
  },
});