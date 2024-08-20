import { CompanySelect } from "./company-select.model";
import { PrefixSelect } from "./prefix-select.model";

export interface DataResponse {
  COMPANIES: CompanySelect[];
  PREFIXES: PrefixSelect[];
}
