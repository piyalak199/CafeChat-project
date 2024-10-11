import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import "./ChatRoom.css"; // Assuming you have this file for styling
import NavbarUser from "./NavbarUser.js";

const socket = io.connect("http://localhost:3001");

export default function RoomPage() {
  const displayName = localStorage.getItem("displayName");
  const username = localStorage.getItem("username");

  const { roomID } = useParams(); // Use roomID from the URL
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentRoomName, setCurrentRoomName] = useState(null); // State for room name
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [messageInput, setMessageInput] = useState(""); // State for input field
  const [userName, setUserName] = useState(displayName);
  const messagesEndRef = useRef(null); // สร้าง ref เพื่อใช้เลื่อนลง

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      }); // เลื่อนไปที่ข้อความสุดท้าย
    }
  };

  useEffect(() => {
    scrollToBottom(); // เรียกใช้ทุกครั้งที่ messages มีการอัปเดต
  }, [messages]);

  useEffect(() => {
    // Fetch chat rooms
    fetch("http://localhost:3001/chatrooms")
      .then((response) => response.json())
      .then((data) => setChatRooms(data))
      .catch((error) => console.error("Error fetching chat rooms:", error));

    if (roomID) {
      // Join the room when roomID is available
      socket.emit("joinRoom", roomID);
      setCurrentRoom(roomID);
      setJoinedRoom(true);

      // Listen for incoming messages
      socket.on("message", (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, text: message.text },
        ]);
      });
    }

    return () => {
      if (currentRoom) {
        socket.emit("leaveRoom", currentRoom);
        setJoinedRoom(false);
      }
      socket.off("message"); // Clean up socket listeners
    };
  }, [roomID]);

  const handleJoinRoom = (room) => {
    if (currentRoom) {
      // Leave the current room before joining a new one
      socket.emit("leaveRoom", currentRoom);
      setJoinedRoom(false);
    }

    // Join the new room and set room name
    socket.emit("joinRoom", room.roomID);
    setCurrentRoom(room.roomID);
    setCurrentRoomName(room.roomName); // Set the room name
    setJoinedRoom(true);
    setMessages([]); // Clear messages when joining a new room
    navigate(`/chatroom/${room.roomID}`);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket.emit("leaveRoom", currentRoom);
      setCurrentRoom(null);
      setCurrentRoomName(null); // Clear room name
      setJoinedRoom(false);
      setMessages([]);
      navigate("/chatroom");
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" && currentRoom) {
      const message = {
        room: currentRoom,
        sender: userName,
        text: messageInput,
      };

      socket.emit("sendMessage", message); // Emit the message to the server
      setMessageInput(""); // Clear the input field
    }
  };

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />

        <div className="flex justify-center">
          <div class="border-b border-black h-32 w-full mx-40 mb-10 rounded-0">
            <div className="grid grid-cols-5 gap-2 ">
              <div className="col-start-1 ">a</div>
              <div className="col-start-2">b</div>
              <div className="col-start-3">c</div>
              <div className="col-start-4">d</div>
              <div className="col-start-5">e</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 self-center mt-10 h-[32rem]">
          {/* Chat Room List */}
          <div className="flex justify-center">
            <div className="items-center box-border h-full w-full mx-16 p-3 border border-black rounded-3xl">
              <div className="grid grid-flow-row auto-rows-max">
                {chatRooms.map((room) => (
                  <button
                    key={room.roomID}
                    onClick={() => handleJoinRoom(room)}
                  >
                    {room.roomName}
                  </button>
                ))}

                <button onClick={handleLeaveRoom}>Leave Room</button>
              </div>
            </div>
          </div>

          {/* Chat Messages Section */}
          <div className="col-span-4 flex justify-center">
            <div className="box-border h-full w-full mr-16 p-4 border border-black rounded-3xl message-container">
              <div>
                {joinedRoom ? (
                  <div>
                    <div class="grid grid-rows-10 grid-col-1 gap-2">
                      <div class="row-span-1 ">
                        <h2 className="row">
                          {currentRoomName
                            ? `Room: ${currentRoomName}`
                            : "Select a room to start chatting"}
                        </h2>
                      </div>
                      <div class="row-start-2 row-end-10">
                        <div className="messages">
                          <div className="w-full h-80 overflow-auto touch-auto">
                            {messages.map((msg, index) => (
                              <div
                                key={index}
                                className={`flex ${
                                  msg.sender === userName
                                    ? "justify-end"
                                    : "justify-start"
                                } mb-2`}
                              >
                                <div className="text-right">
                                  {" "}
                                  {/* ใช้ text-right เมื่อเป็นข้อความของผู้ใช้ */}
                                  <div>
                                    <small
                                      className={`text-xs text-gray-600 ${
                                        msg.sender === userName
                                          ? "float-right"
                                          : "float-left"
                                      }`} /* จัดให้ชื่ออยู่ขวาเมื่อเป็นของผู้ใช้ */
                                    >
                                      {msg.sender === userName
                                        ? "You"
                                        : msg.sender}
                                    </small>
                                  </div>
                                  <div
                                    className={`${
                                      msg.sender === userName
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                                    } p-2 rounded-lg max-w-xs break-words clear-both`}
                                  >
                                    <span>{msg.text}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </div>
                      </div>
                      <div class="row-start-10 row-end-10">
                        <div className="position-relative">
                          <div className="input-group ">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              placeholder="Type your message..."
                              className="form-control message-input"
                              aria-label="Message"
                            />
                            <button
                              onClick={handleSendMessage}
                              className="btn btn-primary"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h4> เลือกห้องแชทเพื่อเริ่มพูดคุยสิ !!! </h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
