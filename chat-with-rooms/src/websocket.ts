import { io } from "./http";

interface IRoomUser {
  socketId: string;
  username: string;
  room: string;
}

interface IMessage {
  username: string;
  room: string;
  text: string;
  createdAt: Date;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("select-room", (data, callback) => {
    console.log("[Event select-room] User logged into a room.", data);

    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      console.log("[Event select-room] User already in room.", userInRoom);
      userInRoom.socketId = socket.id;
    } else {

      var newUserInRoom: IRoomUser = {
        socketId: socket.id,
        username: data.username,
        room: data.room,
      };

      users.push(newUserInRoom);

      console.log("[Event select-room] User has been added to the room.", newUserInRoom);
    }

    const messagesRoom = getMessages(data.room);

    console.log("[Event select-room] callback from event.", messagesRoom);

    callback(messagesRoom);
  });

  socket.on("send-message", (data) => {
    console.log("[Event send-message] Message received.", data);
    const message: IMessage = {
      username: data.username,
      room: data.room,
      text: data.text,
      createdAt: new Date(),
    };

    messages.push(message);

    // Send message to all users in the room.
    io.to(data.room).emit("send-message", message);
  });
});

function getMessages(room: string) {
  return messages.filter((message) => message.room === room);
}