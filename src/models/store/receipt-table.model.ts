import { CompareProcessView } from "../data/compare-process-view.model";

export interface ReceiptTable {
  TOTAL_CHECKED: number;
  TOTAL: number;
  RECEIPTS: CompareProcessView[];
}
