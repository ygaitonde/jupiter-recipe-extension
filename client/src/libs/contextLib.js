import { useContext, createContext } from "react";

export const AppContext = createContext(null);
//for use with Authentication 
export function useAppContext() {
  return useContext(AppContext);
}