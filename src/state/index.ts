export interface TableState {
  id: string;

  width: number;
  height: number;

  data: string[];
}

export type ClientTableState = {
  table: TableState;
  revertStack: TableStateAction[];
};

export type ServerTableState = {
  table: TableState;
  offset: number;
};

export type TableStateAction = {
  offset: number;
} & (
  | { type: "reset"; table: TableState }
  | {
      type: "edit";
      offset: number;
      previousValue: string;
      value: string;
    }
);

export type ServerAction = never;
export type ClientAction = { type: "reset" };

export const createInitState = (width = 40, height = 100): TableState => ({
  id: "test",
  width,
  height,

  data: [...Array(width * height)].map((_, i) => {
    const x = Math.round((i / width - Math.floor(i / width)) * width);
    const y = Math.floor(i / width);

    if (x < 10 && y < 10) {
      return `${x};${y}`;
    }

    return "";
  }),
});

export const action = <const T extends TableStateAction>(action: T) => action;
