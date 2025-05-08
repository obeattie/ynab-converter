import { UTCDate } from "@date-fns/utc";
import { parse as parseCSV } from "csv-parse/browser/esm/sync";
import { parse as parseDate } from "date-fns";
import { zipObject } from "es-toolkit";
import type { Transaction } from "../transaction";
import { readBuffer } from "../util";

const debitPurchaseRe = /^Purchase ZKB Visa Debit card no. xxxx \d{4},\s*(.*)$/i;
const transferRe = /^Credit originator:\s*(.+)$/i;

function parseDetails(record: Record<string, string>): [string, string] {
  const zkbDetails = record.Details;
  const zkbBookingText = record["Booking text"];
  let [payee, memo] = [zkbBookingText, zkbDetails];
  if (debitPurchaseRe.test(zkbBookingText)) {
    payee = debitPurchaseRe.exec(zkbBookingText)![1];
  } else if (transferRe.test(zkbBookingText)) {
    payee = zkbDetails;
  }
  return [payee, memo];
}

export async function readZKBCSV(input: ArrayBuffer): Promise<Transaction[]> {
  const csv: string[][] = parseCSV(readBuffer(input), {
    delimiter: ";",
  });
  const headers = csv[0];

  return csv
    .slice(1)
    .map((values) => zipObject(headers, values))
    .map((record): Transaction => {
      const [payee, memo] = parseDetails(record);
      return {
        date: parseDate(record["Value date"] || record.Date, "dd.MM.yyyy", new UTCDate()),
        currency: "CHF",
        amount:
          record["Debit CHF"] !== ""
            ? -Number.parseFloat(record["Debit CHF"])
            : Number.parseFloat(record["Credit CHF"]),
        balance: Number.parseFloat(record["Balance CHF"]),
        payee,
        memo,
        cleared: record["Value date"] !== "",
      };
    });
}
