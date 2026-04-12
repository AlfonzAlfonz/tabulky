import { useState } from "react";
import { createInitState } from "../state";
import { AppContext } from "./AppContext";
import { Table } from "./Table";

export const App = () => {
  const [state, setState] = useState(() => createInitState());

  const [focused, setFocused] = useState<{ offset: number; value: string }>();

  return (
    <AppContext.Provider
      value={{
        state,
        focused,
        setFocused: (offset) =>
          setFocused({ offset, value: state.data[offset] }),
        editFocused: (value) => setFocused((s) => ({ ...s, value })),
        submitFocused: () => {
          if (!focused) return;

          const newArray = [...state.data];
          newArray[focused.offset] = focused.value;
          setState({ ...state, data: newArray });
        },
      }}
    >
      <Table />
    </AppContext.Provider>
  );
};
