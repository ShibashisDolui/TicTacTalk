import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { createContext, useLayoutEffect, useState } from "react";
import JoinGame from "./components/JoinGame";
import api_key from "./utils/secrets";

export const AuthContext = createContext();

function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  useLayoutEffect(() => {
    if (token) {
      client
        .connectUser(
          {
            id: cookies.get("userId"),
            name: cookies.get("username"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        )
        .then((user) => {});
      setIsAuth(true);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={setIsAuth}>
      <div className='App'>
        {isAuth ? (
          <div className='container'>
            <Chat client={client}>
              <JoinGame />
            </Chat>
          </div>
        ) : (
          <>
            <SignUp setIsAuth={setIsAuth} />
            <Login setIsAuth={setIsAuth} />
          </>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
