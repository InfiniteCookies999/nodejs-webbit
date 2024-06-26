import { createContext } from "react";

export const PopupType = Object.freeze({
  NONE: 0,
  SIGNUP: 1,
  LOGIN: 2,
  CREATE_COMMUNITY: 3,
  CHANGE_EMAIL: 4,
  CHANGE_PASSWORD: 5,
  CHANGE_GENDER: 6,
  CHANGE_PROFILE_PIC: 7,
});

export const PopupContext = createContext({
  stateType: PopupType.NONE
});
