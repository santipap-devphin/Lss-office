import { Reducer } from "react";
import { CompareProcessView } from "../models/data/compare-process-view.model";
import { Quater } from "../models/data/quater.model";
import { Attachment } from "../models/schemas/filebrowser/attachment.model";
import { FileBrowserSchema } from "../models/schemas/filebrowser/file-browser-schema.model";
import { Account } from "../models/store/account.model";
import { Company } from "../models/store/company.model";
import { Contact } from "../models/store/contact.model";
import { CRRDetail } from "../models/store/crr-detail.model";
import { DocumentLife } from "../models/store/document-life.model";
import { DocumentNonLife } from "../models/store/document-non-life.model";
import { User } from "../models/user/user.model";

export const InitialState: IAppData = {
  account: null,
  attachments: [],
  company: null,
  contacts: [],
  crr: null,
  document: null,
  quaters: [],
  receipts: [],
  schemas: [],
  auth: null,
};

export interface IAppData {
  document: DocumentLife | DocumentNonLife | null;
  attachments: Attachment[] | [];
  company: Company | null;
  quaters: Quater[] | [];
  receipts: CompareProcessView[] | [];
  contacts: Contact[] | [];
  crr: CRRDetail | null;
  account: Account | null;
  schemas: FileBrowserSchema[] | [];
  auth: User | null;
}

export enum AppActionType {
  Document = "__UD__",
  Attachments = "__ATC__",
  Company = "__COM__",
  Quaters = "__QUA__",
  Receipts = "__RCP__",
  Contacts = "__CTS__",
  CRR = "__CRR__",
  Account = "__AC__",
  Schema = "__SC__",
  Auth = "__AUT__",
  Initialize = "__INIT__",
}

export type AppAction = {
  type: AppActionType;
  payload?:
    | DocumentLife
    | DocumentNonLife
    | Attachment[]
    | Quater[]
    | Contact[]
    | Account
    | CRRDetail
    | CompareProcessView[]
    | FileBrowserSchema[]
    | Company
    | User
    | []
    | null;
};

export const AppReducer: Reducer<IAppData, AppAction> = (state, action) => {
  switch (action.type) {
    case AppActionType.Document: {
      return { ...state, document: { ...action.payload } } as IAppData;
    }
    case AppActionType.Attachments: {
      return {
        ...state,
        attachments: [...(action.payload as Attachment[])],
      } as IAppData;
    }
    case AppActionType.Company: {
      return { ...state, company: { ...action.payload } } as IAppData;
    }
    case AppActionType.Quaters: {
      return {
        ...state,
        quaters: [...(action.payload as Quater[])],
      } as IAppData;
    }
    case AppActionType.Receipts: {
      return {
        ...state,
        receipts: [...(action.payload as CompareProcessView[])],
      } as IAppData;
    }
    case AppActionType.Contacts: {
      return {
        ...state,
        contacts: [...(action.payload as Contact[])],
      } as IAppData;
    }
    case AppActionType.CRR: {
      return {
        ...state,
        crr: { ...action.payload },
      } as IAppData;
    }
    case AppActionType.Account: {
      return {
        ...state,
        account: { ...action.payload },
      } as IAppData;
    }

    case AppActionType.Schema: {
      return {
        ...state,
        schemas: [...(action.payload as FileBrowserSchema[])],
      } as IAppData;
    }

    case AppActionType.Initialize: {
      return {
        ...InitialState,
      } as IAppData;
    }

    case AppActionType.Auth: {
      return { ...state, auth: { ...action.payload } } as IAppData;
    }
    default: {
      return { ...state };
    }
  }
};
