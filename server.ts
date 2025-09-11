import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

interface User {
  id: string;
  name: string;
}

interface Room {
  id: string;
  users: User[];
  favoriteBook: any;
}

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms: Record<string, Room> = {};

io.on('connection', (socket: Socket) => {
  console.log('New connection:', socket.id);

  socket.on('create-room', (data: { roomId: string, userName: string, favoriteBook: any }) => {
    const { roomId, userName, favoriteBook } = data;
    
    rooms[roomId] = {
      id: roomId,
      users: [{ id: socket.id, name: userName }],
      favoriteBook
    };
    
    socket.join(roomId);
    socket.emit('room-created', { roomId });
    io.to(roomId).emit('room-joined', { users: rooms[roomId].users });
  });

  socket.on('join-room', (data: { roomId: string, userName: string, favoriteBook: any }) => {
    const { roomId, userName, favoriteBook } = data;
    
    if (rooms[roomId]) {
      rooms[roomId].users.push({ id: socket.id, name: userName });
      socket.join(roomId);
      socket.emit('room-joined', { users: rooms[roomId].users });
      socket.to(roomId).emit('user-joined', { id: socket.id, name: userName });
    } else {
      socket.emit('room-not-found');
    }
  });

  socket.on('message', (data: { roomId: string, user: string, text: string, isEmoji: boolean }) => {
    socket.to(data.roomId).emit('message', {
      user: data.user,
      text: data.text,
      isEmoji: data.isEmoji
    });
  });

  socket.on('offer', (data: { roomId: string, offer: RTCSessionDescriptionInit }) => {
    socket.to(data.roomId).emit('offer', data.offer);
  });

  socket.on('answer', (data: { roomId: string, answer: RTCSessionDescriptionInit }) => {
    socket.to(data.roomId).emit('answer', data.answer);
  });

  socket.on('ice-candidate', (data: { roomId: string, candidate: RTCIceCandidateInit }) => {
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const userIndex = room.users.findIndex(u => u.id === socket.id);
      
      if (userIndex !== -1) {
        const [user] = room.users.splice(userIndex, 1);
        socket.to(roomId).emit('user-left', user.id);
        
        if (room.users.length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});