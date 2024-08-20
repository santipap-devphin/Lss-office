import { Reducer } from "react";
import { Company } from "../models/store/company.model";

export enum CompanyActionType {
  Replace = "RPC",
  SetValue = "STV",
  Clear = "CLR",
}

export type CompanyAction = {
  type: CompanyActionType;
  payload?: Company | { key: string; value: any } | null;
};

export const CompanyReducer: Reducer<Company | null, CompanyAction> = (
  state: Company | null,
  action
) => {
  switch (action.type) {
    case CompanyActionType.Replace: {
      return { ...action.payload } as Company;
    }

    case CompanyActionType.SetValue: {
      const { key, value } = action.payload as { key: string; value: any };
      let tmp = { ...state } as Record<string, any>;
      tmp[key] = value;

      return { ...tmp } as Company;
    }

    case CompanyActionType.Clear: {
      return null;
    }

    default: {
      throw Error("Invalid type reducer!");
    }
  }
};
