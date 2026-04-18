import { DatabaseSync } from "node:sqlite";
import {
  createInitState,
  type ServerTableState,
  type TableState,
} from "../src/state/index.ts";

export type Db = ReturnType<typeof createDb>;

export const createDb = () => {
  const db = new DatabaseSync("./data.sqlite");

  db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      width INT NOT NULL,
      height INT NOT NULL,
      tableData TEXT NOT NULL
    );
  `);

  return {
    get: (id: string): ServerTableState => {
      let table = db.prepare("SELECT * FROM tables WHERE id = ?").get(id);

      if (!table) {
        const state = createInitState();
        table = db
          .prepare(
            "INSERT INTO tables (id, width, height, tableData) VALUES(?, ?, ?, ?) RETURNING id, width, height, tableData",
          )
          .get(
            state.id,
            state.width,
            state.height,
            JSON.stringify(state.data),
          )!;
      }

      return {
        table: {
          id: String(table.id),
          width: Number(table.width),
          height: Number(table.height),
          data: JSON.parse(String(table.tableData ?? "[]")),
        },
        offset: 0,
      };
    },
    update: (state: TableState) => {
      db.prepare(
        "UPDATE tables SET width = ?, height = ?, tableData = ? WHERE id = ?",
      ).run(state.width, state.height, JSON.stringify(state.data), state.id);
    },
  };
};
