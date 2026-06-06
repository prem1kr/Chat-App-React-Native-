For a WhatsApp-like app, don't replace your REST APIs with Socket.IO. Use **both**:

* **REST API** → save/fetch data from MongoDB.
* **Socket.IO** → real-time updates (new messages, typing, online status, read receipts, group updates).

## 1. Connection Flow

### Frontend

Connect after login:

```js
import { io } from "socket.io-client";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

socket.connect();

socket.emit("join", userId);
```

### Backend

```js
export const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    });
};
```

---

# 2. Private Chat Messages

### After saving message in DB

In your `sendMessage` controller:

```js
const populatedMessage = await messageModel
    .findById(message._id)
    .populate("sender", "name profilePic");
```

Emit to receiver:

```js
io.to(receiverId).emit("newMessage", populatedMessage);
```

Frontend:

```js
useEffect(() => {
    socket.on("newMessage", (message) => {
        dispatch(addMessage(message));
    });

    return () => {
        socket.off("newMessage");
    };
}, []);
```

---

# 3. Chat List Updates

When a new message arrives:

Backend:

```js
io.to(receiverId).emit("chatUpdated", {
    chatId,
    lastMessage: text,
});
```

Frontend Chat List Screen:

```js
socket.on("chatUpdated", (chat) => {
    dispatch(updateChat(chat));
});
```

No need to refetch all chats.

---

# 4. Group Messages

When sending to group:

```js
const group = await groupModel.findById(groupId);
```

Emit to all members:

```js
group.members.forEach(member => {
    io.to(member.toString()).emit(
        "groupMessage",
        populatedMessage
    );
});
```

Frontend:

```js
socket.on("groupMessage", (message) => {
    dispatch(addGroupMessage(message));
});
```

---

# 5. Online / Offline Status

### Backend

```js
socket.on("join", async (userId) => {
    await userModel.findByIdAndUpdate(
        userId,
        { isOnline: true }
    );

    socket.broadcast.emit("userOnline", userId);
});
```

### Disconnect

```js
socket.on("disconnect", async () => {
    await userModel.findByIdAndUpdate(
        userId,
        { isOnline: false }
    );

    socket.broadcast.emit("userOffline", userId);
});
```

Frontend:

```js
socket.on("userOnline", userId => {
    dispatch(setOnline(userId));
});

socket.on("userOffline", userId => {
    dispatch(setOffline(userId));
});
```

---

# 6. Read Receipts

When chat opens:

```js
await markAsRead(messageId);

socket.emit("messageRead", {
    messageId,
    senderId,
});
```

Backend:

```js
socket.on("messageRead", (data) => {
    io.to(data.senderId).emit(
        "messageReadUpdate",
        data
    );
});
```

Frontend:

```js
socket.on("messageReadUpdate", (data) => {
    dispatch(updateReadStatus(data));
});
```

---

# 7. Delivered Receipts

Backend:

```js
io.to(senderId).emit(
    "messageDelivered",
    messageId
);
```

Frontend:

```js
socket.on("messageDelivered", (messageId) => {
    dispatch(markDelivered(messageId));
});
```

---

# 8. Typing Indicator

Frontend:

```js
socket.emit("typing", {
    receiverId,
    chatId,
});
```

Backend:

```js
socket.on("typing", (data) => {
    io.to(data.receiverId).emit(
        "userTyping",
        data
    );
});
```

Frontend:

```js
socket.on("userTyping", () => {
    setTyping(true);
});
```

---

# Recommended Architecture

### REST APIs

Use for:

```txt
POST /chat/create
GET  /chat/list
GET  /chat/:id

POST /group/create
GET  /group/:id

POST /message/send
GET  /message/chat/:id
GET  /message/group/:id
```

### Socket.IO

Use for:

```txt
newMessage
groupMessage
chatUpdated
userOnline
userOffline
typing
messageRead
messageDelivered
memberAdded
memberRemoved
groupUpdated
groupDeleted
```

A common pattern is:

1. User sends message.
2. Frontend calls `POST /message/send`.
3. Backend saves to MongoDB.
4. Backend emits Socket.IO event.
5. Receiver instantly sees the new message.
6. Chat list updates automatically.

This gives you persistence through MongoDB and real-time behavior through Socket.IO.
