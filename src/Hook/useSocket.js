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

    // Handle connection error
    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Save socket instance to state
    setSocket(socketInstance);

    // Cleanup: Disconnect socket on component unmount
    return () => {
      socketInstance.disconnect();
      console.log("Socket disconnected");
    };
  }, [url]); // Re-run if the URL changes

  return socket; // Expose the socket instance
};

export default useSocket;
