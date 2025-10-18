import { io } from "socket.io-client";


const socket = io("http://143.198.9.144:9095", {
  transports: ["websocket"],
});

export default socket;
