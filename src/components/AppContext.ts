import { createContext, useContext } from "react";
import type { TableStateWithHistory } from "../state/reducer";

export interface IAppContext {
  state: TableStateWithHistory;

  focused?: {
    offset: number;
    value: string;
  };

  setFocused: (offset: number) => void;
  editFocused: (value: string) => void;
  submitFocused: () => void;
}

export const AppContext = createContext<IAppContext>(null!);

export const useApp = () => useContext(AppContext);
