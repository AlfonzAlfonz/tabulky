import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import {
  createInitState,
  type ClientAction,
  type TableState,
  type TableStateAction,
} from "../src/state/index.ts";
import { tableStateReducer } from "../src/state/reducer.ts";

interface RoomState {
  state: TableState;
  clients: Set<Socket>;
  offset: number;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = new Map<string, RoomState>();

const init = (): RoomState => ({
  state: createInitState(),
  clients: new Set(),
  offset: 0,
});

io.on("connection", (socket) => {
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

  if (!rooms.has(id)) {
    rooms.set(id, init());
  } else {
    rooms.get(id)!.clients.add(socket);
  }

  const room = rooms.get(id)!;
  socket.emit("table-action", {
    type: "reset",
    state: room.state,
    offset: room.offset,
  } satisfies TableStateAction);

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });

  socket.on("table-action", (action: TableStateAction) => {
    const room = rooms.get(id);
    if (!room) return;

    const state = tableStateReducer(room.state, action);

    rooms.set(id, { ...room, state });
    for (const client of room.clients) {
      if (client === socket) continue;
      client.emit("table-action", action);
    }
  });

  socket.on("meta-action", (action: ClientAction) => {
    if (action.type === "reset") {
      const room = rooms.get(id)!;
      socket.emit("table-action", {
        type: "reset",
        state: room.state,
        offset: room.offset,
      } satisfies TableStateAction);
      return;
    }

    // action satisfies never;
  });
});

server.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
