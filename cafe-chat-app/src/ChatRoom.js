import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import "./ChatRoom.css"; // Assuming you have this file for styling

const socket = io.connect("http://localhost:3001");

export default function RoomPage() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [messageInput, setMessageInput] = useState(""); // State for input field

  useEffect(() => {
    // Fetch chat rooms
    fetch("http://localhost:3001/chatrooms")
      .then(response => response.json())
      .then(data => setChatRooms(data))
      .catch(error => console.error("Error fetching chat rooms:", error));

    if (roomID) {
      // Join the room when roomID is available
      socket.emit('joinRoom', roomID);
      setCurrentRoom(roomID);
      setJoinedRoom(true);

      // Listen for incoming messages
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (currentRoom) {
        socket.emit('leaveRoom', currentRoom);
        setJoinedRoom(false);
      }
      socket.off('message'); // Clean up socket listeners
    };
  }, [roomID]);

  const handleJoinRoom = (room) => {
    if (currentRoom) {
      // Leave the current room before joining a new one
      socket.emit('leaveRoom', currentRoom);
      setJoinedRoom(false);
    }

    // Join the new room
    socket.emit('joinRoom', room.roomID);
    setCurrentRoom(room.roomID);
    setJoinedRoom(true);
    setMessages([]); // Clear messages when joining a new room
    navigate(`/chatroom/${room.roomID}`);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket.emit('leaveRoom', currentRoom);
      setCurrentRoom(null);
      setJoinedRoom(false);
      setMessages([]);
      navigate('/chatroom');
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" && currentRoom) {
      const message = { room: currentRoom, text: messageInput };

      socket.emit('sendMessage', message); // Emit the message to the server
      // setMessages((prevMessages) => [...prevMessages, message]); // Add message to local state
      setMessageInput(""); // Clear the input field
    }
  };

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <header>Chat Application</header>

        <div className="grid grid-cols-5 gap-2 self-center mt-10 h-[32rem]">
          {/* Chat Room List */}
          <div className="flex justify-center">
            <div className="items-center box-border h-full w-full mx-16 p-3 border border-black rounded-3xl">
              <div className="grid grid-flow-row auto-rows-max">
                {chatRooms.map(room => (
                  <button key={room.roomID} onClick={() => handleJoinRoom(room)}>
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
                    <div>{currentRoom ? `Room: ${currentRoom}` : "Select a room to start chatting"}</div>
                    <div className="messages">
                      {messages.map((msg, index) => (
                        <div key={index}>{msg.text}</div>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="message-input"
                    />
                    <button onClick={handleSendMessage}>Send</button>
                  </div>
                ) : (
                  <div>Select a room to start chatting with friends.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
