import { useState } from "react";

export default function TestState(){
    const [username, setUsername] = useState();

    return (
        <>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <span>Your username is {username}</span>
        </>
    );
}