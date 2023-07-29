import React, { useContext, useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { AuthContext } from "../App";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setIsAuth = useContext(AuthContext);

  const cookies = new Cookies();
  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username,
      password,
    }).then((res) => {
      const { firstName, lastName, username, token, userId } = res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      setIsAuth(true);
    });
  };
  return (
    <div className='login'>
      <label> Login</label>

      <input
        placeholder='Username'
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        placeholder='Password'
        type='password'
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Login</button>
    </div>
  );
}

export default Login;
