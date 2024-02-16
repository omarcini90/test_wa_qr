import { Server } from "socket.io";
import logger from "./utils/logger";


export const initiateScoket = (server: any) => {
  const io = new Server(server, {
    path: "/socket/"
  })

  io.on("connection", (socket) => {
    logger.info("a user connected");
  })

  return io
}