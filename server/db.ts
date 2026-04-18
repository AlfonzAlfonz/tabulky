import { nanoid } from "nanoid";
import { DatabaseSync, type SQLOutputValue } from "node:sqlite";
import {
  createInitState,
  type ServerTableState,
  type TableState,
} from "../src/state/index.ts";

export type Db = ReturnType<typeof createDb>;

export const createDb = (signal: AbortSignal) => {
  const db = new DatabaseSync("./data.sqlite");

  signal.addEventListener("abort", () => db.close());

  db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      width INT NOT NULL,
      height INT NOT NULL,
      tableData TEXT NOT NULL
    );
  `);

  const tableModel = (table: Record<string, SQLOutputValue>) => {
    return {
      table: {
        id: String(table.id),
        width: Number(table.width),
        height: Number(table.height),
        data: JSON.parse(String(table.tableData ?? "[]")),
      },
      offset: 0,
    };
  };

  return {
    create: () => {
      const state = createInitState(nanoid());
      const { id } = db
        .prepare(
          "INSERT INTO tables (id, width, height, tableData) VALUES(?, ?, ?, ?) RETURNING id",
        )
        .get(state.id, state.width, state.height, JSON.stringify(state.data))!;

      return String(id);
    },
    get: (id: string): ServerTableState | undefined => {
      const table = db.prepare("SELECT * FROM tables WHERE id = ?").get(id);

      if (!table) {
        return undefined;
      }

      return tableModel(table);
    },
    update: (state: TableState) => {
      db.prepare(
        "UPDATE tables SET width = ?, height = ?, tableData = ? WHERE id = ?",
      ).run(state.width, state.height, JSON.stringify(state.data), state.id);
    },
  };
};
