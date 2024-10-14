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
            roleID: results[0].roleID,
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

// // Get all pet types
// app.get("/api/pettype", checkAuth, (req, res) => {
//   const query = "SELECT * FROM pettype";

//   pool.query(query, (error, results) => {
//     if (error) {
//       return res.json({
//         result: false,
//         message: error.message,
//       });
//     }
//     res.json({
//       result: true,
//       data: results,
//     });
//   });
// });

// // Route to update the user's pet type
// app.post("/api/updatePetType", checkAuth, (req, res) => {
//   const { userID, petTypeID } = req.body;
//   const sql = "UPDATE user SET petTypeID = ? WHERE userID = ?";

//   pool.query(sql, [petTypeID, userID], (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: "Error updating pet type" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     res.send({ message: "Pet type updated successfully" });
//   });
// });


// Get all pet types
app.get("/api/pettype", checkAuth, (req, res) => {
  const query = "SELECT * FROM pettype";

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ // Use 500 status code for server errors
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
    return res.status(400).send({ message: "userID and petTypeID are required" });
  }

  const sql = "UPDATE user SET petTypeID = ? WHERE userID = ?";

  pool.query(sql, [petTypeID, userID], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error updating pet type: " + err.message });
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
app.post("/api/addUserHat", checkAuth,async (req, res) => {
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

app.get("/api/userHats/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT hatID FROM user_hat WHERE userID = ?";

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
app.post("/api/addUserCloth",async (req, res) => {
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

app.get("/api/usercloth/:userID", async (req, res) => {
  const userID = req.params.userID;
  const sql = "SELECT clothID FROM user_cloth WHERE userID = ?";

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
