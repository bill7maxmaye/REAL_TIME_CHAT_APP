/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socketConnection, setSocket] = useState(null);

  useEffect(() => {
    const socketConnectionss = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    setSocket(socketConnectionss);

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};
