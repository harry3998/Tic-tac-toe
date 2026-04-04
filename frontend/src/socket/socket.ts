import { io } from "socket.io-client";
// import { SERVER_URL } from "../config/config";

const socket = io("http://localhost:8000");

export const emitEvent = (event: string, data: any) => {
  socket.emit(event, data);
};

export const socketOn = (event: string, callback: (data: any) => void) => {
  socket.on(event, callback);
};

export const socketOff = (event: string) => {
  socket.off(event);
};