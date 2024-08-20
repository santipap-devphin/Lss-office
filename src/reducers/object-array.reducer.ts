import { Reducer } from "react";

export enum ObjectArrayActionType {
  Replace = "_RPC_",
  Add = "_ADD_",
  Edit = "_EDT_",
  Remove = "_REM_",
}

export type ObjectArrayAction = {
  type: ObjectArrayActionType;
  payload:
    | any
    | { id: string; value: any }
    | { id: string; data: any }
    | { id: string };
};

export const ObjectArrayReducer: Reducer<any[] | null, ObjectArrayAction> = (
  state,
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case ObjectArrayActionType.Replace: {
      return [...payload];
    }
    case ObjectArrayActionType.Add: {
      return [...(state as any[]), { ...(payload as any) }];
    }
    case ObjectArrayActionType.Edit: {
      const { id, data } = payload as { id: string; data: any };
      let tmp = [...(state as any[])] as any[];
      tmp[tmp.findIndex((x) => x.id === id)] = { ...data };
      return [...tmp];
    }
    case ObjectArrayActionType.Remove: {
      const { id } = payload as { id: string };
      return [...(state as Record<string, any>[]).filter((x) => x.id !== id)];
    }

    default: {
      throw Error(`${type} is invalid action of Object Array!`);
    }
  }
};
