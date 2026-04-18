import { createContext, useContext } from "react";
import type { ClientTableState } from "../state";

export interface IAppContext {
  state: ClientTableState;

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
