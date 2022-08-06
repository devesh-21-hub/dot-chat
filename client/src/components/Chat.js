import { useState, useEffect, useRef, Fragment } from "react";
import { useLocation } from "react-router-dom";

import moment from "moment";

import ChatSide from "./ChatSide/ChatSide";

import classes from "./Chat.module.css";

import { io } from "socket.io-client";
const socket = io("http://localhost:8000");
const now = new Date();

const Chat = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get("user");
  const userRoom = params.get("room");

  //const inputRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [inputData, setInputData] = useState("");

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleFormClick = (e) => {
    e.preventDefault();

    //const inputData = inputRef.current.value;

    //acknowledgement cotains the data received from the server from callback("")

    socket.emit(
      "input",
      { sender: username, meSSage: inputData, room: userRoom },
      (err, acknowledgement) => {
        if (!err) {
        }
      }
    );

    //inputRef.current.value = "";
    setInputData("");
  };
  const [message, setMessage] = useState({ data1: "", data2: "", data3: "" });
  const [inputMessage, setInputMessage] = useState([
    {
      message: {
        sender: "",
        meSSage: "Hey " + username + ", Start a new conversation",
        time: now.toString(),
      },
      key: 0,
    },
  ]);

  useEffect(() => {
    socket.on("message", (data1, data2, data3) => {
      setMessage({ data1, data2, data3 });
    });

    socket.on("userconnection", (data) => {
      setInputMessage((prevState) => {
        const k = data.createdAt;
        return [
          ...prevState,
          {
            message: { sender: "", meSSage: data.text },
            key: k,
          },
        ];
      });
    });

    socket.on(
      "input-message",
      (data, createdAt) => {
        if (data.room === userRoom)
          setInputMessage((prevState) => {
            return [
              ...prevState,
              {
                message: {
                  sender: data.sender,
                  meSSage: data.meSSage,
                  time: createdAt,
                },
                key: createdAt,
              },
            ];
          });
        //console.log(userRoom);
        scrollToBottom();
      },
      () => {
        //console.log("Message sent");
      }
    );
  }, [username, userRoom]);

  useEffect(() => {
    socket.on("roomData", ({ room, users }) => {
      setOnlineUsers(users.length);
      //console.log(room, users);
    });
  });

  //
  return (
    <section>
      <ChatSide />
      <div className={classes.onlineUsers}>
        <h2>Currently Online</h2>
        <p>{onlineUsers}</p>
      </div>
      <div className={classes.main}>
        <ul>
          {inputMessage.message !== "" &&
            inputMessage.map((Message) => {
              const listClass = `${
                Message.message.sender !== username && classes.selectlist
              } ${classes.borderlist}`;

              return (
                <li className={listClass} key={Message.key} ref={bottomRef}>
                  {Message.message.sender}
                  {Message.message.sender !== "" && ": "}
                  {Message.message.meSSage}

                  <span className={classes.time}>
                    {moment(Message.message.time).format("h:mm A")}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <form onSubmit={handleFormClick} className={classes.inputarea}>
        <input
          // ref={inputRef}
          value={inputData}
          onChange={handleInputChange}
          type="text"
          className={classes.input}
          placeholder="Enter"
          autoFocus={true}
        />

        <button
          disabled={inputData === ""}
          type="submit"
          className={classes.btn}
        >
          {"Send >>"}
        </button>
      </form>
    </section>
  );
};

export default Chat;
/*

<p>{message.data1}</p>
      <p>{message.data2}</p>
      <p>{message.data3}</p>
      <h1>This is the chat page!</h1>
*/
