import React, { useEffect, useLayoutEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import Patterns from "../utils/WinningPatterns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Board({ result, setResult, restartGame }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [turnCount, setTurnCount] = useState(0);
  const [myMove, setMyMove] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  console.log("Hello");

  // Check for win patterns when the board changes
  useLayoutEffect(() => {
    if (turnCount === 1) {
      setMyMove("O");
    }
    if (result.state === "none") {
      checkWin();
    }
  }, [board]);

  // Update the board with empty spaces when the result changes
  useLayoutEffect(() => {
    if (result.state === "won" || result.state === "tie") {
      setBoard(
        board.map((val) => {
          if (val === "") {
            return " ";
          }
          return val;
        })
      );
    }
  }, [result]);

  // Restart the game
  restartGame = async () => {
    setBoard(
      board.map((val) => {
        return "";
      })
    );
    setPlayer("X");
    setTurn("X");
    setResult({ winner: "none", state: "none" });
    await channel.sendEvent({
      type: "restart",
    });
  };

  // Choose a square and update the board
  const chooseSquare = async (square) => {
    if (turn === player && (board[square] !== "X" || board[square] !== "O")) {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player, turnCount: parseInt(turnCount + 1) },
      });

      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }
          return val;
        })
      );
    }
  };

  // Check for winning patterns
  const checkWin = () => {
    let hasWon = false;
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        hasWon = true;
        if (board[currPattern[0]] === myMove) {
          toast("You won");
        } else {
          toast("You lost this time. Try again...");
        }
        setResult({ winner: board[currPattern[0]], state: "won" });
      }
    });
    if (!hasWon) {
      checkIfTie();
    }
  };

  // Check if the game is tied
  const checkIfTie = () => {
    let filled = true;

    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      console.log("Tied");
      toast("Game tied");
      setResult({ winner: "none", state: "tie" });
    }
  };

  useEffect(() => {
    // Listen for game move event
    const gameMoveEvent = (event) => {
      if (event.type === "game-move" && event.user.id !== client.userID) {
        const currentPlayer = event.data.player === "X" ? "O" : "X";
        setPlayer(currentPlayer);
        setTurn(currentPlayer);
        setTurnCount(event.data.turnCount);
        setBoard(
          board.map((val, idx) => {
            if (idx === event.data.square && val === "") {
              return event.data.player;
            }
            return val;
          })
        );
      }
    };

    // Listen for restart event
    const restartEvent = (event) => {
      if (event.type === "restart") {
        setBoard(
          board.map((val) => {
            return "";
          })
        );
        setPlayer("X");
        setTurn("X");
        setResult({ winner: "none", state: "none" });
      }
    };

    channel.on(gameMoveEvent);
    channel.on(restartEvent);

    return () => {
      channel.off(gameMoveEvent);
      channel.off(restartEvent);
    };
  }, [board]);

  return (
    <div className='board'>
      <div className='row'>
        <Square
          val={board[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
        />
        <Square
          val={board[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
        />
        <Square
          val={board[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
        />
      </div>
      <div className='row'>
        <Square
          val={board[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
        />
        <Square
          val={board[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
        />
        <Square
          val={board[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
        />
      </div>
      <div className='row'>
        <Square
          val={board[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
        />
        <Square
          val={board[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
        />
        <Square
          val={board[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
        />
      </div>
      {result.state !== "none" && (
        <button className='restart-button' onClick={restartGame}>
          <span>Restart</span>
        </button>
      )}
    </div>
  );
}

export default Board;
