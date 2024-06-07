import { createContext } from "react";

export const PopupType = Object.freeze({
  NONE: 0,
  SIGNUP: 1,
  LOGIN: 2
});

export const PopupContext = createContext({
  stateType: PopupType.NONE
});