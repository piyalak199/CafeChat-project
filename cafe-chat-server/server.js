const util = require("util");
var jwt = require("jsonwebtoken");
const multer = require("multer");
var md5 = require("md5");
const path = require("path");
const bodyParser = require("body-parser");

const User = require("./libs/User");
const ChatRoom = require("./libs/ChatRoom");

const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "cafechat",
  port: 3306,
});

const server = app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

const { Server } = require("socket.io");
const { error } = require("console");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// let roomUsers = {};

// io.on('connection', (socket) => {
//   console.log('New user connected');

//   // Join room
//   socket.on('joinRoom', ({ roomID, userName }) => {
//     socket.join(roomID);

//     // Add user to room
//     if (!roomUsers[roomID]) {
//       roomUsers[roomID] = [];
//     }
//     roomUsers[roomID].push(userName);

//     // Notify all users in the room of the updated user list
//     io.to(roomID).emit('roomUsers', roomUsers[roomID]);
//     console.log(`${userName} joined room: ${roomID}`);
//   });

//   // Handle user leaving the room
//   socket.on('leaveRoom', ({ roomID, userName }) => {
//     socket.leave(roomID);

//     // Remove user from room
//     roomUsers[roomID] = roomUsers[roomID].filter((user) => user !== userName);

//     // Notify all users in the room of the updated user list
//     io.to(roomID).emit('roomUsers', roomUsers[roomID]);
//     console.log(`${userName} left room: ${roomID}`);
//   });

//   // Handle user disconnecting
//   socket.on('disconnect', () => {
//     // Find which room the disconnected user was in and remove them
//     for (const roomID in roomUsers) {
//       roomUsers[roomID] = roomUsers[roomID].filter(
//         (user) => user !== socket.userName
//       );
//       io.to(roomID).emit('roomUsers', roomUsers[roomID]);
//     }
//     console.log('User disconnected');
//   });
// });

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific chat room
  socket.on("joinRoom", (roomID) => {
    socket.join(roomID);
    console.log(`User joined room ${roomID}`);
  });

  // Leave a specific chat room
  socket.on("leaveRoom", (roomID) => {
    socket.leave(roomID);
    console.log(`User left room ${roomID}`);
  });

  // Handle sending messages to a specific room
  socket.on("sendMessage", (message) => {
    const { room, text, sender } = message;
    if (room) {
      io.to(room).emit("message", { text, sender });
      console.log(` ${sender} send Message to room ${room}: ${text}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Fetch chat rooms
app.get("/chatrooms", (req, res) => {
  pool.query("SELECT * FROM chatroom", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Fetch specific chat room
app.get("/chatrooms/:id", (req, res) => {
  const roomID = req.params.id;
  pool.query(
    "SELECT * FROM chatroom WHERE roomID = ?",
    [roomID],
    (error, results) => {
      if (error) throw error;
      res.json(results[0]);
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello World by Express! all");
});

app.use("/img", express.static("img"));

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.query(
    "SELECT * FROM user WHERE username = ? AND password = MD5(?) ",
    [username, password],
    function (error, results, fields) {
      if (error) {
        res.json({
          result: false,
          message: error.message,
        });
      }
      if (results.length) {
        res.json({
          result: true,
        });
      } else {
        res.json({
          result: false,
          message: "ไม่พบ Username หรือ Password ไม่ถูกต้อง",
        });
      }
    }
  );
});

app.post("/api/authen_request", (req, res) => {
  const sql = "SELECT * FROM user WHERE MD5(username) = ? ";
  pool.query(sql, [req.body.username], (error, results) => {
    var response;
    if (error) {
      response = {
        result: false,
        message: error.message,
      };
    } else {
      if (results.length) {
        var payload = { username: req.body.username };
        var secretKey = "MySecretKey";
        const authToken = jwt.sign(payload, secretKey);
        response = {
          result: true,
          data: {
            auth_token: authToken,
          },
        };
      } else {
        response = {
          result: false,
          message: "Username ไม่ถูกต้อง",
        };
      }
    }

    res.json(response);
  });
});

app.post("/api/access_request", (req, res) => {
  const authenSignature = req.body.authen_signature;
  const authToken = req.body.auth_token;

  var decoded = jwt.verify(authToken, "MySecretKey");

  if (decoded) {
    const query =
      "SELECT a.userID, a.username, a.displayName, a.coin ,a.petTypeID, p.petName, p.petImg, r.roleID, r.roleName " +
      "FROM user a " +
      "INNER JOIN pettype p ON (a.petTypeID = p.petTypeID) " +
      "INNER JOIN roles r ON (a.roleID = r.roleID) " +
      "WHERE MD5(CONCAT(username, '&' , password)) = ? ";

    pool.query(query, [authenSignature], (error, results) => {
      var response;
      if (error) {
        response = {
          result: false,
          message: error.message,
        };
      } else {
        if (results.length) {
          var payload = {
            userID: results[0].userID,
            username: results[0].username,
            displayName: results[0].displayName,
            coin: results[0].coin,
            petTypeID: results[0].petTypeID,
            // petName: results[0].petName,
            // petImg: results[0].petImg,
            roleID: results[0].roleID,
            // roleName: results[0].roleName,
          };
          const accessToken = jwt.sign(payload, "MySecretKey");
          response = {
            result: true,
            data: { access_token: accessToken, account_info: payload },
          };
        } else {
          response = {
            result: false,
            message: "Username หรือ Password ไม่ถูกต้อง ",
          };
        }
      }

      res.json(response);
    });
  }
});

let checkAuth = (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  if (token) {
    jwt.verify(token, "MySecretKey", (err, decoded) => {
      if (err) {
        res.send(
          JSON.stringify({
            result: false,
            message: "ไม่ได้เข้าสู่ระบบ",
          })
        );
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).send("Not authorized");
  }
};

app.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    invalidateToken(token);

    res.status(200).send({
      result: true,
      message: "ออกจากระบบเรียบร้อยแล้ว",
    });
  } else {
    res.status(401).send({
      result: false,
      message: "ไม่ได้รับโทเค็น",
    });
  }
});

// ฟังก์ชันสมมุติเพื่อยกเลิกโทเค็น
function invalidateToken(token) {
  // ทำการลบโทเค็นออกจากฐานข้อมูล หรือเก็บใน blacklist
  // database.deleteToken(token); // ตัวอย่างการลบโทเค็นออกจากฐานข้อมูล
  console.log(`Token ${token} invalidated.`);
}

app.get("/api/Register", (req, res) => {
  const query = "SELECT * FROM roles";

  pool.query(query, (error, results) => {
    if (error) {
      res.json({
        result: false,
        message: error.message,
      });
    } else {
      res.json({
        result: true,
        data: results,
      });
    }
  });
});

app.get("/api/Register/user/:userID", checkAuth, (req, res) => {
  const userID = req.params.userID;
  const sql =
    "SELECT a.*, b.roleName " +
    "FROM user a " +
    "JOIN roles b ON a.roleID = b.roleID ";

  if (userID == 0) {
    pool.query(sql, (error, results) => {
      if (error) {
        res.json({
          result: false,
          message: error.message,
        });
      } else {
        res.json({
          result: true,
          data: results,
        });
      }
    });
  } else {
    pool.query(sql + "WHERE a.roleID = ?", [userID], (error, results) => {
      if (error) {
        res.json({
          result: false,
          message: error.message,
        });
      } else {
        res.json({
          result: true,
          data: results,
        });
      }
    });
  }
});

app.post("/api/Register/add", async (req, res) => {
  const input = req.body;

  try {
    var result = await User.createUser(
      pool,
      input.username,
      input.password,
      input.roleID
    );

    res.json({
      result: true,
    });
  } catch (ex) {
    res.json({
      result: false,
      message: ex.message,
    });
  }
});

///getByuserId
app.get("/api/Register/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    var result = await User.getByuserId(pool, userID);

    res.json({
      result: true,
      data: result,
    });
  } catch (ex) {
    res.json({
      result: false,
      message: ex.message,
    });
  }
});

app.get("/chatroom/:chatroomId", async (req, res) => {
  const chatroomId = req.params.chatroomId;

  try {
    var results = await ChatRoom.getByRoomID[(pool, chatroomId)];

    res.json({
      result: true,
      data: results,
    });
  } catch (ex) {
    res.json({
      result: false,
      message: ex.message,
    });
  }
});

// Get all pet types
app.get("/api/pettype", checkAuth, (req, res) => {
  const query = "SELECT * FROM pettype";

  pool.query(query, (error, results) => {
    if (error) {
      return res.json({
        result: false,
        message: error.message,
      });
    }
    res.json({
      result: true,
      data: results,
    });
  });
});
// Route to get pet types
app.get("/api/pettype", (req, res) => {
  const sql = "SELECT petTypeID, petName, petImg FROM pettype";
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error fetching pet types" });
    }
    res.send({ data: result });
  });
});

// Route to get user details (including petTypeID)
app.get("/api/user/:userID", (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT petTypeID FROM user WHERE userID = ?";
  pool.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error fetching user data" });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ data: result[0] });
  });
});

// Route to update the user's pet type
app.post("/api/updatePetType", (req, res) => {
  const { userID, petTypeID } = req.body;
  const sql = "UPDATE users SET petTypeID = ? WHERE userID = ?";

  pool.query(sql, [petTypeID, userID], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error updating pet type" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "Pet type updated successfully" });
  });
});
