import { useEffect, useReducer, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ClientAction, TableStateAction } from "../state";
import { clientTableStateReducer } from "../state/reducer";
import { AppContext } from "./AppContext";
import { Table } from "./Table";

export const App = () => {
  const [state, dispatchLocalAction] = useReducer(
    clientTableStateReducer,
    undefined,
  );

  const ref = useRef<Socket>(null);

  const [focused, setFocused] = useState<{ offset: number; value: string }>();

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      query: { id: "test" },
    });

    let offset = 0;

    socket.on("table-action", (action: TableStateAction) => {
      console.log("table-action", action);
      if (action.type === "reset") {
        offset = action.offset;
      } else {
        if (action.offset - offset !== 1) {
          console.warn("Offset mismatch");
          socket.emit("meta-action", { type: "reset" } satisfies ClientAction);
        }
      }

      dispatchLocalAction(action);
    });

    ref.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const dispatchAction = (a: TableStateAction) => {
    dispatchLocalAction(a);
    ref.current?.emit("table-action", a);
  };

  if (!state) return;

  return (
    <AppContext.Provider
      value={{
        state,
        focused,
        setFocused: (offset) =>
          setFocused({ offset, value: state.table.data[offset] }),
        editFocused: (value) => setFocused((s) => s && { ...s, value }),
        submitFocused: () => {
          if (!focused) return;
          dispatchAction({
            type: "edit",
            offset: focused.offset,
            value: focused.value,
            previousValue: state.table.data[focused.offset],
          });
          setFocused(undefined);
        },
      }}
    >
      <Table />
    </AppContext.Provider>
  );
};
