import { Account } from "../store/account.model";
import { Quater } from "./quater.model";
import { Company } from "../store/company.model";

export interface AccountData {
  ACCOUNT: Account | null;
  QUATER: Quater[] | null;
  COMPANY: Company | null;
}
