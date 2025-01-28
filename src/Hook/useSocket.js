import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const useSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(url);

    // Log when connected
    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Save socket instance to state
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      console.log("Socket disconnected");
    };
  }, [url]);
  return socket;
};

export default useSocket;
