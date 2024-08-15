import React, { useState, useEffect } from "react";
import "./RoomPage.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3001");

export default function RoomPage() {
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const joinRoom = async () => {
    if (room !== "") {
      socket.emit("join_room", room);
      await loadPreviousMessages(room); // Load previous messages when joining the room
    }
  };

  const loadPreviousMessages = async (room) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://localhost:3001/chatroom/${room}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.result) {
        setMessages(response.data.data); // Set previous messages
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (message !== "" && room !== "") {
      const newMessage = { message, room };

      try {
        await axios.post("http://localhost:3001/send_message", newMessage);

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage(""); // Clear input field after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    return () => {
      socket.off("receive_message");
    };
  }, []);
  

  if (localStorage.getItem("access_token")) {
    return (
      <div>
        <div className="container absolute inset-x-0 top-0">
          <header>Chat Application</header>

          <div className="flex justify-center items-center">
            <div className="box-border h-32 w-3/4 border-b border-black flex justify-center items-center">
              <div>Userlist in chatroom</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 self-center mt-10 h-[32rem]">
            <div className="flex justify-center">
              <div className="items-center box-border h-full w-full mx-16 p-3 border border-black rounded-3xl">
                <div className="grid grid-flow-row auto-rows-max">
                  <div>
                    <input
                      className="input"
                      onChange={(event) => setRoom(event.target.value)}
                    />
                    <button onClick={joinRoom}>Join</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex justify-center">
              <div className="box-border h-full w-full mr-16 p-4 border border-black rounded-3xl message-container">
                <div>
                  {messages.map((msg, index) => (
                    <div key={index}>Message: {msg.message}</div>
                  ))}
                  <form className="form" onSubmit={sendMessage}>
                    <input
                      placeholder="พูดคุยกับเพื่อนๆสิ..."
                      className="input"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
