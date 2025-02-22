import { stringify } from "csv-stringify/browser/esm/sync";
import { formatDate } from "date-fns";
import type { Transaction } from "./transaction";

type ynabTransaction = {
	Date: string;
	Payee: string;
	Memo: string;
	Outflow: string;
	Inflow: string;
};

export function ynabCSV(transactions: Transaction[]): string {
	console.log(transactions);
	const ynabTransactions = transactions.map(
		(tx): ynabTransaction => ({
			Date: formatDate(tx.date, "yyyy-MM-dd"),
			Payee: tx.payee,
			Memo: tx.memo ?? "",
			Outflow: tx.amount <= 0 ? (-tx.amount).toFixed(2) : "",
			Inflow: tx.amount > 0 ? (-tx.amount).toFixed(2) : "",
		}),
	);
	return stringify(ynabTransactions, { header: true });
}
