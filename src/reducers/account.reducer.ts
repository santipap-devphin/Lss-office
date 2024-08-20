import { Reducer } from "react";
import { Account } from "../models/store/account.model";

export enum AccountActionType {
  Replace = "RPC",
  SetValue = "STV",
  Clear = "CLR",
}

export type AccountAction = {
  type: AccountActionType;
  payload?: Account | { key: string; value: any } | null;
};

export const AccountReducer: Reducer<Account | null, AccountAction> = (
  state: Account | null,
  action
) => {
  switch (action.type) {
    case AccountActionType.Replace: {
      return { ...action.payload } as Account;
    }

    case AccountActionType.SetValue: {
      const { key, value } = action.payload as { key: string; value: any };
      let tmp = { ...state } as Record<string, any>;
      tmp[key] = value;

      return { ...tmp } as Account;
    }

    case AccountActionType.Clear: {
      return null;
    }

    default: {
      throw Error("Invalid type reducer!");
    }
  }
};
