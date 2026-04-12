import { useReducer, useState } from "react";
import { createInitState } from "../state";
import { AppContext } from "./AppContext";
import { Table } from "./Table";
import { tableStateReducer } from "../state/reducer";

export const App = () => {
  const [state, dispatchLocalAction] = useReducer(tableStateReducer, {
    table: createInitState(),
    revertStack: [],
  });

  const [focused, setFocused] = useState<{ offset: number; value: string }>();

  return (
    <AppContext.Provider
      value={{
        state,
        focused,
        setFocused: (offset) =>
          setFocused({ offset, value: state.table.data[offset] }),
        editFocused: (value) => setFocused((s) => ({ ...s, value })),
        submitFocused: () => {
          if (!focused) return;
          dispatchLocalAction({
            type: "edit",
            offset: focused.offset,
            value: focused.value,
            previousValue: state.table.data[focused.offset],
          });
        },
      }}
    >
      <Table />
    </AppContext.Provider>
  );
};
