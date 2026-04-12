import type { TableState } from ".";

export type TableStateWithHistory = {
  table: TableState;
  revertStack: TableStateAction[];
};

type TableStateAction = {
  type: "edit";
  offset: number;
  previousValue: string;
  value: string;
};

export const tableStateReducer = (
  state: TableStateWithHistory,
  action: TableStateAction,
): TableStateWithHistory => {
  switch (action.type) {
    case "edit": {
      const newArray = [...state.table.data];
      newArray[action.offset] = action.value;
      return {
        ...state,
        table: {
          ...state.table,
          data: newArray,
        },
        revertStack: [...state.revertStack, action],
      };
    }
  }
};
