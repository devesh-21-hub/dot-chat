import { io } from "socket.io-client";

const socket = io("ws://localhost:8000");

/*

const socket = io("http://localhost:8000", {
  path: "/chat",
  query: {}
});

const socket = io("https://example.com"); // the main namespace
const productSocket = io("https://example.com/product"); // the "product" namespace
const orderSocket = io("https://example.com/order"); // the "order" namespace


*/

const printMessage = () => {
  socket.on("message", (data) => {
    return data;
  });
};

export default printMessage;
