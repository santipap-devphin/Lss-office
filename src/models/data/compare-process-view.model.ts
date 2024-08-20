export interface CompareProcessView {
  CODE: string;
  DATE: Date;
  QUARTER: number;
  YEAR: number;
  QUARTER_YEAR: string;
  SUM_DELIVER_AMOUNT: number;
  SUM_CRR_AMOUNT: number;
  DIFF_AMOUNT: number;
  TYPE: string;
  STATUS: string;
  ENABLE: string;
  DEL: string;
  CREATED_DATE: Date;
  CREATE_USER: string;
  UPDATED_DATE: Date;
  UPDATE_USER: string;
  COMPANY_CODE: string;
  COMPANY_QUATER_CODE: string;
  COMPANY_TYPE_CODE: string;
  TYPE_CODE: string;
  STATUS_CODE: string;
  CHECKED: boolean;
  CY_NAME:string;
}
