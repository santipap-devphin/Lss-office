import { Reducer } from "react";

export enum ObjectActionType {
  Replace = "RPC",
  SetValue = "SET",
}

export type ObjectAction = {
  type: ObjectActionType;
  payload: any | null | { key: string; value: any };
};

export const ObjectReducer: Reducer<any | null, ObjectAction> = (
  state: any | null,
  action
) => {
  switch (action.type) {
    case ObjectActionType.Replace: {
      return { ...action.payload };
    }

    case ObjectActionType.SetValue: {
      let tmp = state as Record<string, any>;
      const { key, value } = action.payload as { key: string; value: any };
      tmp[key] = value;

      return { ...tmp };
    }

    default: {
      throw Error(`${action.type} is not supported for Object Reducer!`);
    }
  }
};
