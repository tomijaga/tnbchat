import type { PaginatedBlockEntry } from "./block";
import type { PaginatedEntryMetadata } from "../entry-metadata";

export interface PaginatedTransactionEntry {
  id: string;
  block: PaginatedBlockEntry & PaginatedEntryMetadata;
  amount: number;
  fee?:string;
  memo?:string;
  recipient: string;
}
