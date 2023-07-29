import { useContext } from "react";
import { AuthContext } from "../App";
import Cookies from "universal-cookie";
import api_key from "../utils/secrets";
import { StreamChat } from "stream-chat";

const LogOut = () => {
  const setIsAuth = useContext(AuthContext);
  const client = StreamChat.getInstance(api_key);
  const cookies = new Cookies();

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  return (
    <div>
      <button style={{ padding: "10px", fontWeight: "bold" }} onClick={logOut}>
        {" "}
        Log Out
      </button>
    </div>
  );
};

export default LogOut;
