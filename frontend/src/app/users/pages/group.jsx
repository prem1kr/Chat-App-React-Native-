import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getGroupById, addMember, removeMember, updateGroup, deleteGroup } from "@/hooks/useGroup";
import { getGroupMessages, sendMessage, } from "@/hooks/useMessage";
import { socket } from "@/socket/socket";
import AppHeader from "../../../components/appHeader";
import { Ionicons } from "@expo/vector-icons";
import GroupModal from "../../../components/groupModal";
import { getAlluser } from "../../../hooks/useAuth";
import MembersModal from "../../../components/memebersModal";
import { useDispatch, useSelector } from "react-redux";
import { setGroupMessages, addGroupMessage, updateGroupMessage, deleteGroupMessage, clearGroupMessages } from "../../../redux/slices/groupMessage";
import { setUsers } from '../../../redux/slices/usersSlice';

export default function GroupScreen() {
  const dispatch = useDispatch();
  const { groupId } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const flatListRef = useRef(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const router = useRouter();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const messages = useSelector(state => state.groupMessages.messages || []);
  const users = useSelector(state => state.users.users || []);

  const fetchAllUsers = async () => {
    const response = await getAlluser();
    if (response.success) {
      dispatch(setUsers(response.users));
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
      dispatch(setGroupMessages(msgRes.messages));
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const tempMessage = { _id: Date.now().toString(), text, sender: { _id: userId }, createdAt: new Date().toISOString() };

    dispatch(addGroupMessage(tempMessage));
    const messageText = text;
    setText("");
    await sendMessage({ groupId, text: messageText, messageType: "text" });
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    socket.emit("joinGroup", groupId);
    socket.on("groupMessage", (message) => {
      dispatch(addGroupMessage(message));
    });

    socket.on("groupMessageDeleted", ({ messageId }) => {
      dispatch(deleteGroupMessage(messageId));
    });

    socket.on("groupMessageUpdated", (message) => {
      dispatch(updateGroupMessage(message));
    });

    return () => {
      socket.off("groupMessage");
      socket.off("groupUpdated");
      socket.off("groupDeleted");
      socket.off("groupMessageDeleted");
      socket.off("groupMessageUpdated");
    };
  }, []);

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
      <AppHeader title="" isAdmin={isAdmin} onMenuPress={() => setShowGroupModal(true)} onMembers={() => setShowMembersModal(true)} >

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {group?.groupImage ? (
          <Image source={{ uri: group.groupImage }} style={styles.headerAvatar} />
        ) : (
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{group?.groupName?.split(" ").map((n) => n[0]).join("").toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{group?.groupName}</Text>
          <Text style={styles.headerMembers}>{group?.members?.length} Members</Text>
        </View>

      </AppHeader>

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

      <MembersModal visible={showMembersModal} onClose={() => setShowMembersModal(false)} members={group?.members || []} />

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
  groupAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#4ec28d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: "#4ec28d",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  headerAvatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  headerInfo: {
    flex: 1,
  },

  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  headerMembers: {
    fontSize: 12,
    color: "#6B7280",
  },
  menuButton: {
    padding: 5,
  },
});