import {
  createContext,
  useReducer,
  useContext,
  FC,
  ReactNode,
  Dispatch,
} from "react";
import {
  ContactReducer,
  ContactAction,
  ContactActionType,
} from "../reducers/contact.reducer";
import { Account } from "../models/store/account.model";
import { DocumentLife } from "../models/store/document-life.model";
import { DocumentNonLife } from "../models/store/document-non-life.model";
import { Company } from "../models/store/company.model";
import { CRRDetail } from "../models/store/crr-detail.model";
import { Contact } from "../models/store/contact.model";
import { Quater } from "../models/data/quater.model";
import {
  QuaterAction,
  QuaterActionType,
  QuaterReducer,
} from "../reducers/quater.reducer";
import {
  AccountAction,
  AccountActionType,
  AccountReducer,
} from "../reducers/account.reducer";
import {
  CompanyAction,
  CompanyActionType,
  CompanyReducer,
} from "../reducers/company.reducer";
import {
  DocumentAction,
  DocumentActionType,
  DocumentReducer,
} from "../reducers/document.reducer";
import { CRRAction, CRRActionType, CRRReducer } from "../reducers/crr.reducer";

interface IDataContext {
  account: Account | null;
  document: DocumentLife | DocumentNonLife | null;
  company: Company | null;
  crr: CRRDetail | null;
  quater: Quater[] | null;
  contacts: Contact[] | null;
  // Dispatch
  contactDispatch: Dispatch<ContactAction>;
  documentDispatch: Dispatch<DocumentAction>;
  accountDispatch: Dispatch<AccountAction>;
  companyDispatch: Dispatch<CompanyAction>;
  quaterDispatch: Dispatch<QuaterAction>;
  crrDispatch: Dispatch<CRRAction>;
  clearData(): Promise<boolean>;
}

const DataContext = createContext<IDataContext>({
  account: null,
  document: null,
  company: null,
  crr: null,
  quater: [],
  contacts: [],
  contactDispatch: () => {},
  documentDispatch: () => {},
  accountDispatch: () => {},
  companyDispatch: () => {},
  quaterDispatch: () => {},
  crrDispatch: () => {},
  clearData: () => Promise.resolve(true),
});

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [account, accountDispatch] = useReducer(AccountReducer, null);
  const [company, companyDispatch] = useReducer(CompanyReducer, null);
  const [doc, documentDispatch] = useReducer(DocumentReducer, null);
  const [contacts, contactDispatch] = useReducer(ContactReducer, []);
  const [quater, quaterDispatch] = useReducer(QuaterReducer, []);
  const [crr, crrDispatch] = useReducer(CRRReducer, null);

  const clearData = (): Promise<boolean> => {
    return new Promise((resolve) => {
      accountDispatch({ type: AccountActionType.Clear });
      companyDispatch({ type: CompanyActionType.Clear });
      documentDispatch({ type: DocumentActionType.Clear });
      quaterDispatch({ type: QuaterActionType.Replace, payload: [] });
      contactDispatch({ type: ContactActionType.Replace, payload: [] });
      crrDispatch({ type: CRRActionType.Clear });
      resolve(true);
    });
  };

  return (
    <DataContext.Provider
      value={{
        account,
        document: doc,
        company,
        contacts,
        crr,
        quater,
        contactDispatch,
        accountDispatch,
        documentDispatch,
        companyDispatch,
        quaterDispatch,
        crrDispatch,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
