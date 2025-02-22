import { parse } from "csv-parse/browser/esm/sync";
import { parse as parseDate } from "date-fns";
import { zipObject } from "es-toolkit";
import type { Transaction } from "../transaction";
import { readBuffer } from "../util";

export async function readWiseCSV(input: ArrayBuffer): Promise<Transaction[]> {
	const csv: string[][] = parse(readBuffer(input));
	const headers = csv[0];

	return csv
		.slice(1)
		.map((values) => zipObject(headers, values))
		.map(
			(record): Transaction => ({
				date: parseDate(record.Date, "dd-MM-yyyy", new Date()),
				currency: record.Currency,
				amount: Number.parseFloat(record.Amount),
				balance: Number.parseFloat(record["Running Balance"]),
				payee: record.Merchant,
				memo: record.Description,
			}),
		);
}
