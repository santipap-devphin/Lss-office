import { AccountData } from "./account-data.model";

export interface LoginData {
  NAME: string;
  LASTNAME: string;
  EMAIL: string;
  TOKEN: string;
  DATA: AccountData;
}
