import express from "express";
import http from "http";
import { Server } from "socket.io";
import {
  type ClientAction,
  type TableStateAction,
} from "../src/state/index.ts";
import { createRoom, type Room } from "./createRoom.ts";
import { createDb } from "./db.ts";

const controller = new AbortController();

const db = createDb(controller.signal);
const app = express();

app.post("/api/create", (_, res) => {
  const id = db.create();

  res.end(id);
});

app.get("/api", (_, res) => res.end("api"));

const server = http.createServer(app);
const io = new Server(server);

const rooms = new Map<string, Room>();

io.on("connection", (socket) => {
  try {
    if (!socket.request.url) {
      socket.disconnect();
      return;
    }

    const url = new URL(socket.request.url, "http://localhost");
    const id = [url.searchParams.get("id")].flat()[0];

    if (!id) {
      socket.disconnect();
      return;
    }

    console.log(`User "${socket.id}" connected to "${id}"`);

    if (!rooms.has(id)) rooms.set(id, createRoom(controller.signal, db, id));
    rooms.get(id)?.subscribe(socket);

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} disconnected`);
      for (const [id, room] of rooms.entries()) {
        if (room.unsubscribe(socket).empty) {
          rooms.delete(id);
        }
      }
    });

    socket.on("table-action", (action: TableStateAction) => {
      const room = rooms.get(id);
      if (!room) return;

      room.receive(socket, action);
    });

    socket.on("meta-action", (action: ClientAction) => {
      const room = rooms.get(id);
      if (!room) return;

      room.receiveClientAction(socket, action);
    });
  } catch {
    socket.disconnect();
  }
});

server.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});

process.on("SIGINT", () => {
  console.log("Exiting...");
  controller.abort();
  io.close();
  server.close();

  for (const room of rooms.values()) {
    room.persist();
  }
  process.exit(0);
});
