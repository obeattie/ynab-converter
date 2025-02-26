import { parse } from "csv-parse/browser/esm/sync";
import { zipObject } from "es-toolkit";
import type { Transaction } from "../transaction";
import { readBuffer } from "../util";

export async function readRevolutCSV(input: ArrayBuffer): Promise<Transaction[]> {
  const csv: string[][] = parse(readBuffer(input));
  const headers = csv[0];

  return csv
    .slice(1)
    .map((values) => zipObject(headers, values))
    .filter((record) => record.State === "COMPLETED")
    .map(
      (record): Transaction => ({
        date: new Date(record["Completed Date"]),
        currency: record.Currency,
        amount: Number.parseFloat(record.Amount) - Number.parseFloat(record.Fee),
        balance: Number.parseFloat(record.Balance),
        payee: record.Description,
      }),
    );
}
