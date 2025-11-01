// Socket.io Chat Implementation
const connectedUsers = new Map();
const chatRooms = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Yeni kullanıcı bağlandı:', socket.id);
    
    // Kullanıcı bilgisi
    socket.on('user:join', (userData) => {
      connectedUsers.set(socket.id, {
        id: socket.id,
        username: userData.username,
        avatar: userData.avatar,
        rooms: []
      });
      
      // Genel odaya katıl
      socket.join('general');
      connectedUsers.get(socket.id).rooms.push('general');
      
      // Kullanıcı listesini güncelle
      io.to('general').emit('users:update', Array.from(connectedUsers.values()));
    });
    
    // Odaya katıl
    socket.on('room:join', (roomName) => {
      socket.join(roomName);
      const user = connectedUsers.get(socket.id);
      if (user && !user.rooms.includes(roomName)) {
        user.rooms.push(roomName);
      }
      
      socket.to(roomName).emit('user:joined', {
        username: user?.username,
        message: `${user?.username} odaya katıldı`
      });
    });
    
    // Mesaj gönder
    socket.on('message:send', (data) => {
      const user = connectedUsers.get(socket.id);
      const message = {
        id: Date.now(),
        username: user?.username || 'Anonim',
        avatar: user?.avatar,
        content: data.content,
        room: data.room,
        timestamp: new Date()
      };
      
      io.to(data.room).emit('message:received', message);
    });
    
    // Yazıyor göstergesi
    socket.on('typing:start', (roomName) => {
      const user = connectedUsers.get(socket.id);
      socket.to(roomName).emit('user:typing', { username: user?.username });
    });
    
    socket.on('typing:stop', (roomName) => {
      socket.to(roomName).emit('user:stop-typing');
    });
    
    // Bağlantı kesildi
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.rooms.forEach(room => {
          io.to(room).emit('user:left', {
            username: user.username,
            message: `${user.username} ayrıldı`
          });
        });
      }
      connectedUsers.delete(socket.id);
      io.emit('users:update', Array.from(connectedUsers.values()));
      console.log('Kullanıcı ayrıldı:', socket.id);
    });
  });
};
