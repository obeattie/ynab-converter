import { UTCDate } from "@date-fns/utc";
import { parse as parseCSV } from "csv-parse/browser/esm/sync";
import { parse as parseDate } from "date-fns";
import { zipObject } from "es-toolkit";
import type { Transaction } from "../transaction";
import { readBuffer } from "../util";

export async function readWiseCSV(input: ArrayBuffer): Promise<Transaction[]> {
  const csv: string[][] = parseCSV(readBuffer(input));
  const headers = csv[0];

  return csv
    .slice(1)
    .map((values) => zipObject(headers, values))
    .map(
      (record): Transaction => ({
        date: parseDate(record.Date, "dd-MM-yyyy", new UTCDate()),
        currency: record.Currency,
        amount: Number.parseFloat(record.Amount),
        balance: Number.parseFloat(record["Running Balance"]),
        payee: record.Merchant,
        memo: record.Description,
      }),
    );
}
