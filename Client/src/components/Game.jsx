import React, { useEffect, useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";
import { ToastContainer } from "react-toastify";
import LogOut from "./LogOut";

function Game({ channel, setChannel }) {
  let restartGame;
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });

  useEffect(() => {
    const handleUserStartWatching = (event) => {
      setPlayersJoined(event.watcher_count === 2);
    };

    const handleUserStopWatching = (event) => {
      setPlayersJoined(event.watcher_count === 2);
    };

    channel.on("user.watching.start", handleUserStartWatching);
    channel.on("user.watching.stop", handleUserStopWatching);
  }, []);

  const stopWatching = async () => {
    await channel.stopWatching();
    setChannel(null);
    restartGame();
  };

  if (!playersJoined) {
    return (
      <div>
        {" "}
        <h1 style={{ color: "white" }}>Waiting for other player to join...</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <LogOut />
          <button
            style={{ padding: "10px", fontWeight: "bold" }}
            onClick={stopWatching}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='gameContainer'>
      <Board setResult={setResult} result={result} restartGame={restartGame} />
      <Window>
        <MessageList
          disableDateSeparator
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput noFiles />
      </Window>

      <div>
        <button onClick={stopWatching}> Leave Game</button>
      </div>

      <div className='toast-container'>
        {(result.state === "tie" || result.state === "won") && (
          <ToastContainer />
        )}
      </div>
    </div>
  );
}

export default Game;
