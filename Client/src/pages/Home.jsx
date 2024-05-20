import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
import io from "socket.io-client";

import { useSocket } from "../socketContext/SocketContext";

const Home = () => {
  const socketConnection = useSocket();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /***socket connection */
  //socket connection between the client and and the server is a listen an event and emit an event based relation
  //there are times when a client listens to an event emitted by the server using (socketConnection.on) and times it emits an event uisng(socketConnection.emit). so each respond accordigly to specific event

  useEffect(() => {
    // const socketConnection = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    //   auth: {
    //     token: localStorage.getItem("token"),
    //   },
    // });
    if (!socketConnection) return;

    socketConnection.on("connect", () => {
      console.log("Socket connected");
      dispatch(setSocketConnection(true));
    });

    socketConnection.on("disconnect", () => {
      dispatch(setSocketConnection(false));
    });

    //Once connected to the server, the client listens for an event called "onlineUser" from the server.
    //on the server side "onlineUser" event emits

    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    //this socket connection is use by different components like message component when it wants to emit message to the server so it needs to be globally available, thats is why it is saved in the store
    dispatch(setSocketConnection(true));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  console.log("socccc", user.socketConnection);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
