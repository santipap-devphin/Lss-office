import { Reducer } from "react";
import { KeyValuePair } from "../models/reducer/KeyValuePair.model";
import { DocumentLife } from "../models/store/document-life.model";
import { DocumentNonLife } from "../models/store/document-non-life.model";

function instanceOfDocumentLife(obj: any): obj is DocumentLife {
  return true;
}

function instanceOfDocumentNonLife(obj: any): obj is DocumentNonLife {
  return true;
}

export enum DocumentActionType {
  Replace = "RPC",
  Clear = "CLR",
  SetValue = "SET",
}

export type DocumentAction = {
  type: DocumentActionType;
  payload?: DocumentLife | DocumentNonLife | KeyValuePair[] | null;
};

export const DocumentReducer: Reducer<
  DocumentLife | DocumentNonLife | null,
  DocumentAction
> = (state, action) => {
  switch (action.type) {
    case DocumentActionType.Replace: {
      return instanceOfDocumentLife(action.payload)
        ? ({ ...action.payload } as DocumentLife)
        : instanceOfDocumentNonLife(action.payload)
        ? ({ ...action.payload } as DocumentNonLife)
        : null;
    }

    case DocumentActionType.SetValue: {
      const kp = action.payload as KeyValuePair[];
      let doc = { ...state } as Record<string, any>;
      kp.forEach((x) => {
        doc[x.key] = x.value;
      });
      return instanceOfDocumentLife(state)
        ? ({ ...doc } as DocumentLife)
        : instanceOfDocumentNonLife(state)
        ? ({ ...doc } as DocumentNonLife)
        : null;
    }

    case DocumentActionType.Clear: {
      return null;
    }

    default: {
      throw Error("Invalid action type!");
    }
  }
};
