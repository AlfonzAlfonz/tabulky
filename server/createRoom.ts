import { pulse } from "@alfonz/async/pulse";
import { Socket } from "socket.io";
import {
  action,
  type ClientAction,
  type TableStateAction,
} from "../src/state/index.ts";
import { serverTableStateReducer } from "../src/state/reducer.ts";
import type { Db } from "./db.ts";

export type Room = ReturnType<typeof createRoom>;

export const createRoom = (signal: AbortSignal, db: Db, id: string) => {
  let state = db.get(id)!;

  if (!state) {
    throw new Error("Not found");
  }

  const clients = new Set<Socket>();
  let persisted = false;

  const persist = async () => {
    if (persisted) {
      return;
    }

    console.log(`Persisting table ${state.table.id}...`);
    db.update(state.table);
    persisted = true;
  };

  void (async () => {
    // @ts-expect-error
    for await (const _ of pulse(10, "s", signal)) {
      await persist();
    }
  })();

  return {
    subscribe: (socket: Socket) => {
      clients.add(socket);

      socket.emit("table-action", action({ type: "reset", ...state }));
    },
    unsubscribe: (socket: Socket) => {
      clients.delete(socket);
      return { empty: clients.size === 0 };
    },
    receive: (socket: Socket, a: TableStateAction) => {
      state = serverTableStateReducer(state, a);
      persisted = false;

      for (const client of clients) {
        if (client === socket) continue;
        client.emit("table-action", a);
      }
    },
    receiveClientAction: (socket: Socket, a: ClientAction) => {
      if (a.type === "reset") {
        socket.emit("table-action", action({ type: "reset", ...state }));
        return;
      }
    },
    persist,
  };
};
