const util = require("util");
var jwt = require("jsonwebtoken");
const multer = require("multer");
var md5 = require("md5");
const path = require("path");
const bodyParser = require("body-parser");

const User = require("./libs/User");
const ChatRoom = require("./libs/ChatRoom");
const Coin = require("./libs/Coin")

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

  // const { Server } = require("socket.io");
  // const io = new Server(server, {
  //   cors: {
  //     origin: "http://localhost:3000",
  //     methods: ["GET", "POST"],
  //   },
  // });

  // const roomUsers = {}; // เก็บรายชื่อผู้ใช้ในแต่ละห้อง
  // const userRooms = {}; // เก็บห้องที่ผู้ใช้แต่ละคนอยู่

  // io.on("connection", (socket) => {
  //   console.log("A user connected:", socket.id);

  //   // Join a specific chat room
  //   socket.on("joinRoom", ({ roomID, displayName, userID }) => {
  //     socket.join(roomID);
  //     userRooms[socket.id] = { roomID, displayName, userID }; // Save userID

  //     if (!roomUsers[roomID]) {
  //       roomUsers[roomID] = [];
  //     }
  //     roomUsers[roomID].push(displayName);

  //     io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
  //     console.log(`${displayName} (ID: ${userID}) joined room ${roomID}`);
  //   });

  

  //   // Leave a specific chat room
  //   socket.on("leaveRoom", ({ roomID, displayName, userID }) => {
  //     socket.leave(roomID);
  //     if (roomUsers[roomID]) {
  //       roomUsers[roomID] = roomUsers[roomID].filter((user) => user !== displayName);
  //       if (roomUsers[roomID].length === 0) {
  //         delete roomUsers[roomID];
  //       }
  //     }

  //     io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
  //     console.log(`${displayName} (ID: ${userID}) left room ${roomID}`);
  //   });

  //   // Handle disconnect event
  //   socket.on("disconnect", () => {
  //     console.log("A user disconnected:", socket.id);

  //     const userRoom = userRooms[socket.id];
  //     if (userRoom) {
  //       const { roomID, displayName, userID } = userRoom;

  //       socket.leave(roomID);
  //       if (roomUsers[roomID]) {
  //         roomUsers[roomID] = roomUsers[roomID].filter((user) => user !== displayName);
  //         if (roomUsers[roomID].length === 0) {
  //           delete roomUsers[roomID];
  //         }
  //       }

  //       io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
  //       console.log(`${displayName} (ID: ${userID}) disconnected and left room ${roomID}`);
  //     }

  //     delete userRooms[socket.id];
  //   });

  //   // Handle incoming messages
  //   socket.on("sendMessage", (message) => {
  //     io.to(message.room).emit("message", {
  //       sender: message.sender,
  //       text: message.text,
  //     });
  //   });
  // });


  const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const roomUsers = {}; // Store user info (displayName, userID) in each room
const userRooms = {}; // Store the room each user is in, along with their displayName and userID

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific chat room
  socket.on("joinRoom", ({ roomID, displayName, userID, active_hat, active_cloth }) => {
    socket.join(roomID);
    userRooms[socket.id] = { roomID, displayName, userID, active_hat, active_cloth }; // Save userID and roomID for the connected socket

    if (!roomUsers[roomID]) {
      roomUsers[roomID] = [];
    }
    
    // Push an object that includes both displayName and userID
    roomUsers[roomID].push({ displayName, userID, active_hat, active_cloth });

    // Emit the updated list of users in the room, including both displayName and userID
    io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
    console.log(`${displayName} (ID: ${userID}) joined room ${roomID}(hat: ${active_hat}) (cloth: ${active_cloth})`);
  });

  // Leave a specific chat room
  socket.on("leaveRoom", ({ roomID, displayName, userID, active_hat, active_cloth }) => {
    socket.leave(roomID);

    if (roomUsers[roomID]) {
      // Filter out the user who left by matching both displayName and userID
      roomUsers[roomID] = roomUsers[roomID].filter(
        (user) => user.displayName !== displayName || user.userID !== userID || user.active_hat !== active_hat || user.active_cloth !== active_cloth
      );

      if (roomUsers[roomID].length === 0) {
        delete roomUsers[roomID];
      }
    }

    io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
    console.log(`${displayName} (ID: ${userID}) left room ${roomID}`);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    const userRoom = userRooms[socket.id];
    if (userRoom) {
      const { roomID, displayName, userID, active_hat, active_cloth } = userRoom;

      socket.leave(roomID);
      if (roomUsers[roomID]) {
        // Filter out the user who disconnected
        roomUsers[roomID] = roomUsers[roomID].filter(
          (user) => user.displayName !== displayName || user.userID !== userID || user.active_hat !== active_hat || user.active_cloth !== active_cloth
        );

        if (roomUsers[roomID].length === 0) {
          delete roomUsers[roomID];
        }
      }

      io.to(roomID).emit("updateUsersInRoom", roomUsers[roomID]);
      console.log(`${displayName} (ID: ${userID}) disconnected and left room ${roomID}`);
      // console.log(`(hat: ${active_hat}) (cloth: ${active_cloth})`);
    }

    delete userRooms[socket.id];
  });

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    io.to(message.room).emit("message", {
      sender: message.sender,
      text: message.text,
    });
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
      "SELECT a.userID, a.username, a.displayName, a.coin ,a.petTypeID, p.petName, p.petImg, r.roleID, r.roleName, a.active_hat, a.active_cloth " +
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
            roleID: results[0].roleID,
            active_hat: results[0].active_hat,
            active_cloth: results[0].active_cloth
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
      return res.status(500).json({
        // Use 500 status code for server errors
        result: false,
        message: "Error fetching pet types: " + error.message,
      });
    }
    res.json({
      result: true,
      data: results,
    });
  });
});

// Route to update the user's pet type
app.post("/api/updatePetType", checkAuth, (req, res) => {
  const { userID, petTypeID } = req.body;

  // Validate input
  if (!userID || !petTypeID) {
    return res
      .status(400)
      .send({ message: "userID and petTypeID are required" });
  }

  const sql = "UPDATE user SET petTypeID = ? WHERE userID = ?";

  pool.query(sql, [petTypeID, userID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error updating pet type: " + err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "Pet type updated successfully" });
  });
});

// สมมติว่ามีฟังก์ชัน getHatID ในโมดูล Hat
app.get("/api/hats/:hatID", checkAuth, async (req, res) => {
  const hatID = req.params.hatID;
  const sql = "SELECT * FROM hat ";

  if (hatID == 0) {
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
    pool.query(sql + "WHERE hatID = ?", [hatID], (error, results) => {
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

app.post("/api/updateCoins", checkAuth, async (req, res) => {
  const { hatID, userID } = req.body;

  try {
    const result = await User.updateCoins(pool, hatID, userID);

    // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    res.json({ success: true, message: "Coins updated successfully!" });
  } catch (error) {
    console.error("Error updating coins:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Endpoint to add a hat to the user_hat table
app.post("/api/addUserHat", checkAuth, async (req, res) => {
  const input = req.body;

  try {
    // Call a method to insert a new user hat, ensure to create this method in your User model
    var result = await User.addUserHat(pool, input.userID, input.hatID);

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

// สมมติว่ามีฟังก์ชัน getHatID ในโมดูล Hat
app.get("/api/cloth/:clothID", async (req, res) => {
  const clothID = req.params.clothID;
  const sql = "SELECT * FROM cloth ";

  if (clothID == 0) {
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
    pool.query(sql + "WHERE clothID = ?", [clothID], (error, results) => {
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

app.post("/api/updateCoinsCloth", async (req, res) => {
  const { clothID, userID } = req.body;

  try {
    const result = await User.updateCoinsCloth(pool, clothID, userID);

    // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    res.json({ success: true, message: "Coins updated successfully!" });
  } catch (error) {
    console.error("Error updating coins:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Endpoint to add a hat to the user_hat table
app.post("/api/addUserCloth", async (req, res) => {
  const input = req.body;

  try {
    // Call a method to insert a new user hat, ensure to create this method in your User model
    var result = await User.addUserCloth(pool, input.userID, input.clothID);

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

app.post("/api/updateDisplayName", async (req, res) => {
  const { displayName, userID } = req.body;

  try {
    const result = await User.updateDisplayName(pool, displayName, userID);
    res.json({ success: true, message: "DisplayName updated successfully!" });
  } catch (error) {
    console.error("Error updating DisplayName:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.get("/api/usercloth/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT * FROM user_cloth WHERE userID = ?";

  pool.query(sql, [userID], (error, results) => {
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

app.get("/api/userHats/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT * FROM user_hat WHERE userID = ?";

  pool.query(sql, [userID], (error, results) => {
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

// ฟังก์ชัน get Hat Detail UserID
app.get("/api/hatdetailuser/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT h.hatID, h.hatName, h.hatImg, h.hatCoin, uh.hat_active FROM hat h JOIN user_hat uh ON uh.hatID = h.hatID ";

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
    pool.query(sql + "WHERE uh.userID = ?", [userID], (error, results) => {
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

// ฟังก์ชัน get Cloth Detail UserID
app.get("/api/clothdetailuser/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT h.clothID, h.clothName, h.clothImg, h.clothCoin, uh.cloth_active FROM cloth h JOIN user_cloth uh ON uh.clothID = h.clothID ";

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
    pool.query(sql + "WHERE uh.userID = ?", [userID], (error, results) => {
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

// Update Hat Active
app.post("/api/updateHatStatus", async (req, res) => {
  const { userID, hatID } = req.body; // รับข้อมูลจาก body ของ request

  if (!userID || !hatID) {
    return res.status(400).json({
      result: false,
      message: "Missing userID or hatID",
    });
  }

  // SQL statement สำหรับรีเซ็ต hat_active ทั้งหมดเป็น 'n'
  const resetHatStatusSQL = "UPDATE user_hat SET hat_active = 'n' WHERE userID = ?";
  // SQL statement สำหรับอัปเดต hat_active ของหมวกที่เลือกให้เป็น 'y'
  const updateHatStatusSQL = "UPDATE user_hat SET hat_active = 'y' WHERE userID = ? AND hatID = ?";

  try {
    // 1. รีเซ็ตหมวกทั้งหมดของ userID นั้นเป็น 'n'
    pool.query(resetHatStatusSQL, [userID], (resetError, resetResults) => {
      if (resetError) {
        return res.json({
          result: false,
          message: resetError.message,
        });
      }

      // 2. อัปเดตหมวกที่เลือกให้เป็น 'y'
      pool.query(updateHatStatusSQL, [userID, hatID], (updateError, updateResults) => {
        if (updateError) {
          return res.json({
            result: false,
            message: updateError.message,
          });
        }

        res.json({
          result: true,
          message: "Hat status updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error updating hat status",
    });
  }
});

// Update cloth Active
app.post("/api/updateClothStatus", async (req, res) => {
  const { userID, clothID } = req.body; // รับข้อมูลจาก body ของ request

  if (!userID || !clothID) {
    return res.status(400).json({
      result: false,
      message: "Missing userID or clothID",
    });
  }

  // SQL statement สำหรับรีเซ็ต cloth_active ทั้งหมดเป็น 'n'
  const resetClothStatusSQL = "UPDATE user_cloth SET cloth_active = 'n' WHERE userID = ?";
  // SQL statement สำหรับอัปเดต cloth_active ของหมวกที่เลือกให้เป็น 'y'
  const updateClothStatusSQL = "UPDATE user_cloth SET cloth_active = 'y' WHERE userID = ? AND clothID = ?";

  try {
    // 1. รีเซ็ตหมวกทั้งหมดของ userID นั้นเป็น 'n'
    pool.query(resetClothStatusSQL, [userID], (resetError, resetResults) => {
      if (resetError) {
        return res.json({
          result: false,
          message: resetError.message,
        });
      }

      // 2. อัปเดตหมวกที่เลือกให้เป็น 'y'
      pool.query(updateClothStatusSQL, [userID, clothID], (updateError, updateResults) => {
        if (updateError) {
          return res.json({
            result: false,
            message: updateError.message,
          });
        }

        res.json({
          result: true,
          message: "cloth status updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error updating cloth status",
    });
  }
});


// ฟังก์ชัน Type Coin / coinID
app.get("/api/typecoin/:coinID", async (req, res) => {
  const coinID = req.params.coinID;
  const sql = "SELECT coinID, coin, price FROM typecoin  ";

  if (coinID == 0) {
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
    pool.query(sql + "WHERE coinID = ?", [coinID], (error, results) => {
      if (error) {
        res.json({
          result: false,
          message: results,
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

app.post("/api/updateAddCoin", async (req, res) => {
  const { coinID, userID } = req.body;

  try {
    const result = await Coin.updateAddCoin(pool, coinID, userID);

    // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    res.json({ success: true, message: "Coins updated successfully!" });
  } catch (error) {
    console.error("Error updating coins:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// // ฟังก์ชันเพื่อดึงข้อมูลหมวกที่ active ของผู้ใช้ทั้งหมด
// app.get("/api/active-hats", async (req, res) => {
//   const sql = `
//     SELECT
//       h.hatID,
//       h.hatName,
//       h.hatImg,
//       uh.hat_active,
//       uh.userID
//     FROM
//       hat h
//     JOIN user_hat uh ON
//       uh.hatID = h.hatID
//     WHERE
//       uh.hat_active = "y"
//   `;
  
//   pool.query(sql, (error, results) => {
//     if (error) {
//       return res.json({
//         result: false,
//         message: error.message,
//       });
//     }
//     return res.json({
//       result: true,
//       data: results,
//     });
//   });
// });

app.get("/api/active-hats", async (req, res) => {
  const { userID } = req.query; // Get the userID from query parameters

  if (!userID) {
    return res.json({
      result: false,
      message: "Missing userID",
    });
  }

  const sql = `
    SELECT
      h.hatID,
      h.hatName,
      h.hatImg,
      uh.hat_active,
      uh.userID
    FROM
      hat h
    JOIN user_hat uh ON
      uh.hatID = h.hatID
    WHERE
      uh.hat_active = "y"
      AND uh.userID = ?
  `;
  
  pool.query(sql, [userID], (error, results) => {
    if (error) {
      return res.json({
        result: false,
        message: error.message,
      });
    }
    return res.json({
      result: true,
      data: results.length > 0 ? results[0] : null, // Return the active hat or null if not found
    });
  });
});


// ฟังก์ชันเพื่อดึงข้อมูลเสื้อผ้าที่ active ของผู้ใช้ทั้งหมด
app.get("/api/active-clothes", async (req, res) => {
  const sql = `
    SELECT
      h.clothID,
      h.clothName,
      h.clothImg,
      uh.cloth_active,
      uh.userID
    FROM
      cloth h
    JOIN user_cloth uh ON
      uh.clothID = h.clothID
    WHERE
      uh.cloth_active = "y"
  `;

  pool.query(sql, (error, results) => {
    if (error) {
      return res.json({
        result: false,
        message: error.message,
      });
    }
    return res.json({
      result: true,
      data: results,
    });
  });
});

// ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้พร้อมกับข้อมูลประเภทสัตว์เลี้ยง
app.get("/api/user-pets", async (req, res) => {
  const sql = `
    SELECT
      u.userID,
      u.petTypeID,
      p.petName,
      p.petImg
    FROM
      user u
    JOIN pettype p ON 
      u.petTypeID = p.petTypeID
  `;
  
  pool.query(sql, (error, results) => {
    if (error) {
      return res.json({
        result: false,
        message: error.message,
      });
    }
    return res.json({
      result: true,
      data: results,
    });
  });
});


