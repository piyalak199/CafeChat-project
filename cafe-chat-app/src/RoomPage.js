import React, { useState, useEffect ,Component } from "react";
import "./RoomPage.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3001");

export default function RoomPage() {
  //room state
  const [room, setRoom] = useState("");

  //message state
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  // if (!chatroom) return <div>No chatroom data found</div>;

  if (localStorage.getItem("access_token")) {
    return (
      <div>
        <div class="container absolute inset-x-0 top-0">
          <header class="bg-black p-4"></header>

          <div class=" flex justify-center items-center">
            <div class="box-border h-32 w-3/4 border-b border-black flex justify-center items-center">
              <div>Userlist in chatroom</div>
            </div>
          </div>

          <div class="grid grid-cols-5 gap-2 self-center mt-10 h-[32rem] ">
            <div class="flex justify-center ">
              <div class="items-center box-border h-full w-full mx-16 p-3 border border-black rounded-3xl">
                <div class="grid grid-flow-row auto-rows-max">
                  <div>
                    <input
                      className="input"
                      onChange={(event) => {
                        setRoom(event.target.value);
                      }}
                    />
                    <button onClick={joinRoom}>Join</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-4 flex justify-center ">
              <div class="box-border h-full w-full mr-16 p-4 border border-black rounded-3xl">
                <div>
                  <div>
                    <div>message: </div>
                    {messageReceived}
                  </div>

                  <form className="form">
                    <input
                      placeholder="พูดคุยกับเพื่อนๆสิ..."
                      className="input"
                      onChange={(event) => {
                        setMessage(event.target.value);
                      }}
                    />
                    <button onClick={sendMessage}>Send</button>
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
