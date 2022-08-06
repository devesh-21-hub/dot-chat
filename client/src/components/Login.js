import { Link } from "react-router-dom";
import classes from "./Login.module.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";
const socket = io("http://localhost:8000");

const Login = () => {
  const [loginError, setLoginError] = useState(false);
  const usernameRef = useRef();
  const roomRef = useRef();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const userRoom = roomRef.current.value;
    socket.emit("join", { username, userRoom }, (error) => {
      if (error) {
        setLoginError(true);
        alert(
          "Could not join, the username " + username + " is already taken!"
        );
        return;
      }
      navigate(`/chat?user=${username}&room=${userRoom}`);
    });
    usernameRef.current.value = "";
    roomRef.current.value = "";

    //navigate("/chat", { replace: true });
  };

  // useEffect(() => {

  // }, [username, userRoom]);
  return (
    <div className={classes.main}>
      <h1 className={classes.head}>Chat App</h1>
      <p className={classes.description}>
        {loginError
          ? "Try another username"
          : "Please log in to chat with your friends!"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className={classes.formcontainer}>
          <div>
            <label htmlFor="uname">
              <strong>Username</strong>
            </label>
            <input
              ref={usernameRef}
              type="text"
              placeholder="Enter Username"
              name="uname"
              autoComplete="off"
              required
            />
            <label htmlFor="psw">
              <strong>Room</strong>
            </label>
            <input
              ref={roomRef}
              type="text"
              placeholder="Enter Room"
              name="psw"
              autoComplete="off"
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className={classes.container}>
            <label />
            <input type="checkbox" name="remember" /> Remember me
            <span className={classes.psw}>
              <Link className={classes.link} to="/forgot-password">
                Forgot password?
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
