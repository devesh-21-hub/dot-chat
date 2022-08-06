import classes from "./ChatSide.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const ChatSide = () => {
  const [message, setMessage] = useState("");

  const [link, setLink] = useState("");

  /*
  socket.emit("sendLocation", (location, acknowledgement) => {
    //Below line is executed after the location is sent to the server
    console.log("Location sent")
    //Below line is executed when the server sends the acknowledgement from callback()
    console.log("From server: "+acknowledgement)
  })
  
  */

  const geoFindMe = () => {
    function success(position) {
      const latitude = position.coords.latitude;

      const longitude = position.coords.longitude;

      setMessage(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
      setLink(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    }

    const error = () => {
      setMessage("Unable to retrieve your location");
    };

    if (!navigator.geolocation) {
      alert("Geolocation is not available");
      setMessage("Geolocation is not supported by your browser");
    } else {
      alert("Please wait..");
      setMessage("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return (
    <aside className={classes.asideclass}>
      <button className={classes.sideButton} onClick={geoFindMe}>
        Show Location
      </button>

      <button className={classes.sideButton}>Contacts</button>

      <button className={classes.sideButton}>Add Contacts</button>

      <p id="status">{message}</p>
      {link !== "" && (
        <Link to={link} target="_blank">
          Open in Map
        </Link>
      )}
      <br />
      <h2>Contacts</h2>
      <ul>
        <li>Room 1</li>
        <li>Room 2</li>
        <li>Room 3</li>
        <li>Room 4</li>
        <li>Room 5</li>
      </ul>
    </aside>
  );
};

export default ChatSide;
