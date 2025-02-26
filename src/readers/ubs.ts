import { UTCDate } from "@date-fns/utc";
import { parse as parseCSV } from "csv-parse/browser/esm/sync";
import { parse as parseDate } from "date-fns";
import { zipObject } from "es-toolkit";
import type { Transaction } from "../transaction";
import { readBuffer } from "../util";

export async function readUBSCSV(input: ArrayBuffer): Promise<Transaction[]> {
  // Discard everything up to and including the first blank line, as this is a header
  const blankLine = readBuffer(input)
    .split("\n")
    .findIndex((line) => line === "");

  const csv: string[][] = parseCSV(readBuffer(input), {
    delimiter: ";",
    from_line: blankLine !== -1 ? blankLine + 2 : 0,
  });
  const headers = csv[0];

  return csv
    .slice(1)
    .map((values) => zipObject(headers, values))
    .map(
      (record): Transaction => ({
        date: parseDate(record["Trade date"], "yyyy-MM-dd", new UTCDate()),
        currency: record.Currency,
        amount: Number.parseFloat(record.Debit || record.Credit),
        balance: Number.parseFloat(record.Balance),
        payee: record.Description1,
        memo: record.Description2,
      }),
    );
}
