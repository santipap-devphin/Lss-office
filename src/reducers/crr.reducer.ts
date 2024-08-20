import { Reducer } from "react";
import { CRRDetail } from "../models/store/crr-detail.model";

export enum CRRActionType {
  Replace = "RPC",
  Clear = "CLR",
}

export type CRRAction = {
  type: CRRActionType;
  payload?: CRRDetail | null;
};

export const CRRReducer: Reducer<CRRDetail | null, CRRAction> = (
  state,
  action
) => {
  switch (action.type) {
    case CRRActionType.Replace: {
      return { ...action.payload } as CRRDetail;
    }

    case CRRActionType.Clear: {
      return null;
    }

    default: {
      throw Error("Invalid type reducer!");
    }
  }
};
