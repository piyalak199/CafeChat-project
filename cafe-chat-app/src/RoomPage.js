import React, { useState } from "react";
import "./RoomPage.css";


export default function RoomPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

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
                <div>01</div>
                <div>02</div>
              </div>
            </div>
          </div>
          <div class="col-span-4 flex justify-center ">
            <div class="box-border h-full w-full mr-16 p-4 border border-black rounded-3xl">
              <div>
                <ul className="messages">
                  {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
                <form className="form" onSubmit={handleSubmit}>
                  <input
                    className="input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoComplete="off"
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
