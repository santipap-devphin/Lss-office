import { Reducer } from "react";
import { Quater } from "../models/data/quater.model";

export enum QuaterActionType {
  Replace = "RPC",
  Remove = "RMV",
}

export type QuaterAction = {
  type: QuaterActionType;
  payload: Quater[] | { year: number };
};

export const QuaterReducer: Reducer<Quater[] | null, QuaterAction> = (
  state: Quater[] | null,
  action
) => {
  switch (action.type) {
    case QuaterActionType.Replace: {
      return [...(action.payload as Quater[])];
    }

    case QuaterActionType.Remove: {
      let tmp = [...(state as Quater[])];
      tmp.splice(
        tmp.findIndex(
          (x) => x.YEAR === (action.payload as { year: number }).year
        )
      );
      return [...tmp] as Quater[];
    }
    default: {
      throw Error("Invalid action for quater's reducer!");
    }
  }
};
