let roomList = {};


const initializeSocket = (io) => {

    io.on("connection", (socket) => {

      console.log("connection id :", socket.id)
       
        socket.on("create-room", (roomname, username,callback) => {

          if(roomname in roomList  && !roomList[roomname].includes(username)){
        
            callback("Room already Exists");

            return;

          }
          else{

            delete roomList[roomname];
            
            socket.data.username = "admin";
            roomList[roomname] = [username];
            socket.join(roomname);
          }

        });

          
        socket.on("join-room", (roomname, username,callback) => {

          if (!roomList[roomname]) {
            callback("Room does not exist");
            return;

          }
          
          if(roomList[roomname].includes(username)) {
            callback("User is already in the room");
            return;
          }
    
            socket.data.username = "user";
            socket.join(roomname);
            io.to(roomname).emit("join-msg", `${username} joined the chat`);
            
            if (roomList[roomname]) {
              roomList[roomname].push(username);
            }else{
              console.log("room not found");
            }

        });

        socket.on("send-msg", (roomname, data) => {
            io.to(roomname).emit("sharedData", data);
           
        });

        socket.on("leave-room", (roomname, username) => {
          socket.leave(roomname); 
      
          if (roomList[roomname]) {
              roomList[roomname] = roomList[roomname].filter((user) => user !== username);
      
              io.to(roomname).emit("leave-msg", `${username} left the chat`);
      
              if (roomList[roomname].length === 0) {
                  delete roomList[roomname];
              }

          }
      });

      socket.on("userslist", (roomname)=>{
        io.to(roomname).emit("users", roomList[roomname])
      })

      
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export default initializeSocket;
