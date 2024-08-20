import { Reducer } from "react";
import { LSS_T_MENU } from "../models/office/LSS_T_MENU.model";
import { setLocalStorage } from "../functions/LocalStorage";

export enum MenuActionType {
  Set = "__SET__",
  Add = "__ADD__",
  Remove = "__REM__",
  Clear = "__CLR__",
}

export type MenuAction = {
  type: MenuActionType;
  payload?: LSS_T_MENU | LSS_T_MENU[] | { CODE: string } | null;
};

export const MenuReducer: Reducer<LSS_T_MENU[], MenuAction> = (
  state,
  action
) => {
  switch (action.type) {
    case MenuActionType.Set: {
      setLocalStorage("__menus", action.payload);
      return [...(action.payload as LSS_T_MENU[])];
    }
    case MenuActionType.Add: {
      return [...state, action.payload as LSS_T_MENU];
    }
    case MenuActionType.Remove: {
      return [
        ...state.filter(
          (x) => x.CODE !== (action.payload as { CODE: string }).CODE
        ),
      ];
    }
    case MenuActionType.Clear: {
      return [];
    }
    default:
      return state;
  }
};
