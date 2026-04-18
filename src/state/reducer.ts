import type {
  TableState,
  TableStateAction,
  ClientTableState,
  ServerTableState,
} from "./index.ts";

export const tableStateReducer = (
  state: TableState,
  action: TableStateAction,
): TableState => {
  switch (action.type) {
    case "reset": {
      return action.state;
    }
    case "edit": {
      if (!state) return undefined!;
      const newArray = [...state.data];
      newArray[action.offset] = action.value;
      return { ...state, data: newArray };
    }
    default:
      action satisfies never;
      throw new Error("Not implemented");
  }
};

export const clientTableStateReducer = (
  state: ClientTableState | undefined,
  action: TableStateAction,
): ClientTableState | undefined => {
  if (!state) {
    if (action.type === "reset") {
      return {
        table: action.state,
        revertStack: [],
      };
    }
    return undefined;
  }

  switch (action.type) {
    case "reset": {
      return {
        table: tableStateReducer(state.table, action),
        revertStack: state.revertStack,
      };
    }
    case "edit": {
      return {
        table: tableStateReducer(state.table, action),
        revertStack: [...state.revertStack, action],
      };
    }
  }
};

export const serverTableStateReducer = (
  state: ServerTableState,
  action: TableStateAction,
) => {
  return {
    table: tableStateReducer(state.table, action),
    offset: state.offset + 1,
  };
};
