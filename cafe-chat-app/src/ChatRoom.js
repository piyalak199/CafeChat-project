import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_POST, API_GET } from "./api"; // ใช้ฟังก์ชัน API_POST จาก api.js

import "./ChatRoom.css";
import NavbarUser from "./NavbarUser.js";
import Avatar from "./Avatar"; // Import the Avatar component

export default function ChatRoom() {
  const displayName = localStorage.getItem("displayName");
  const userID = localStorage.getItem("userID");
  const active_hat = localStorage.getItem("active_hat");
  const active_cloth = localStorage.getItem("active_cloth");
  const petTypeID = localStorage.getItem("petTypeID");

  const { roomID } = useParams();
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentRoomName, setCurrentRoomName] = useState(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  // const [userName, setUserName] = useState(displayName);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Fetch chat rooms
    fetch("http://localhost:3001/chatrooms")
      .then((response) => response.json())
      .then((data) => setChatRooms(data))
      .catch((error) => console.error("Error fetching chat rooms:", error));

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  const handleJoinRoom = (room) => {
    if (currentRoom) {
      if (socket) {
        socket.emit("leaveRoom", {
          roomID: currentRoom,
          displayName: displayName,
          userID: userID,
          active_hat: active_hat,
          active_cloth: active_cloth,
        });
        setJoinedRoom(false);
        socket.disconnect();
      }
    }

    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);

    newSocket.emit("joinRoom", {
      roomID: room.roomID,
      displayName: displayName + "...",
      userID: userID,
      active_hat: active_hat,
      active_cloth: active_cloth,
    });

    setCurrentRoom(room.roomID);
    setCurrentRoomName(room.roomName);
    setJoinedRoom(true);
    setMessages([]);

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: message.sender, text: message.text },
      ]);
    });

    newSocket.on("updateUsersInRoom", (users) => {
      const usersWithDetails = users.map((user) => ({
        ...user,
      }));

      setUsersInRoom(usersWithDetails);
    });

    navigate(`/chatroom/${room.roomID}`);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      if (socket) {
        socket.emit("leaveRoom", {
          roomID: currentRoom,
          displayName: displayName,
          userID: userID,
          active_hat: active_hat,
          active_cloth: active_cloth,
        });
        socket.disconnect();
      }
      setCurrentRoom(null);
      setCurrentRoomName(null);
      setJoinedRoom(false);
      setMessages([]);
      setUsersInRoom([]);
      navigate("/chatroom");
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" && currentRoom && socket) {
      const message = {
        room: currentRoom,
        sender: displayName,
        text: messageInput,
      };

      socket.emit("sendMessage", message);
      setMessageInput("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    console.log(usersInRoom); // Check the structure of usersInRoom
  }, [usersInRoom]);
  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />

        <div className="flex justify-center">
          <div className="border-b border-black h-32 w-full mx-40 mb-10 rounded-0">
            <h4>Users in room:</h4>
            <ul className="list-inline">
              {usersInRoom.map((user, index) => (
                <li key={index} className="list-inline-item p-16">
                  {user.displayName} (ID: {user.userID})
                  (HatID: {user.active_hat}) (ClothID: {user.active_cloth})
                  <Avatar
                    // activeHats={activeHats} // User's active hats
                    // activeClothes={activeClothes} // User's active clothes
                    // activePet={user.petTypeID} // User's selected pet
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 self-center mt-10 h-[32rem]">
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

          <div className="col-span-4 flex justify-center">
            <div className="box-border h-full w-full mr-16 p-4 border border-black rounded-3xl message-container">
              <div>
                {joinedRoom ? (
                  <div>
                    <div className="grid grid-rows-10 grid-col-1 gap-2">
                      <div className="row-span-1">
                        <h2 className="row">
                          {currentRoomName
                            ? `Room: ${currentRoomName}`
                            : "Select a room to start chatting"}
                        </h2>
                      </div>
                      <div className="row-start-2 row-end-10">
                        <div className="messages">
                          <div className="w-full h-80 overflow-auto touch-auto">
                            {messages.map((msg, index) => (
                              <div
                                key={index}
                                className={`flex ${
                                  msg.sender === displayName
                                    ? "justify-end"
                                    : "justify-start"
                                } mb-2`}
                              >
                                <div className="text-right">
                                  <div>
                                    <small
                                      className={`text-xs text-gray-600 ${
                                        msg.sender === displayName
                                          ? "float-right"
                                          : "float-left"
                                      }`}
                                    >
                                      {msg.sender === displayName
                                        ? "You"
                                        : msg.sender}
                                    </small>
                                  </div>
                                  <div
                                    className={`${
                                      msg.sender === displayName
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

                      <div className="row-start-10 row-end-10">
                        <div className="position-relative">
                          <div className="input-group">
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
