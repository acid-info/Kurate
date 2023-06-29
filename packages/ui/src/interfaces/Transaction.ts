export type TransactionType =
  | "publish persona"
  | "promote"
  | "demote"
  | "publish post";

export interface TransactionRecord {
  timestamp: number;
  repChange: number;
  goChange: number;
  type: TransactionType;
  personaId: string;
}

export interface HistoryData {
  transactions: TransactionRecord[];
}
