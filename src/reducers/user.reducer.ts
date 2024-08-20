import { Reducer } from "react";
import jwt from "jwt-decode";
import { User } from "../models/user/user.model";
import { getLocalStorage, setLocalStorage } from "../functions/LocalStorage";

export enum UserActionType {
  Login = "LG_",
  Logout = "LO_",
  Check = "CK_",
}

export type UserAction = {
  type: UserActionType;
  payload?: User | null;
};

export const UserReducer: Reducer<User | null, UserAction> = (
  state,
  action: UserAction
) => {
  switch (action.type) {
    case UserActionType.Login: {
      setLocalStorage("__refreshToken", action.payload);
      return { ...action.payload } as User;
    }

    case UserActionType.Logout: {
      localStorage.removeItem("__refreshToken");
      return null;
    }

    case UserActionType.Check: {
      const usr = getLocalStorage<User>("__refreshToken");
      if (usr) {
        try {
          if (
            jwt<{ exp: number }>(usr.authToken as string).exp >
            Date.now() / 1000
          ) {
            return { ...usr } as User;
          }
        } catch {
          return null;
        }
      }
      return null;
    }

    default: {
      return { ...state } as User;
    }
  }
};
