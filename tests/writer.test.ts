import { dedent } from "@qnighy/dedent";
import { expect, test } from "vitest";
import type { Transaction } from "../src/transaction";
import { ynabCSV } from "../src/writer";

test("writer", () => {
	const txs: Transaction[] = [
		{
			date: new Date(2025, 0, 1),
			currency: "CHF",
			amount: 1000,
			balance: 1000,
			payee: "Money Corp",
			memo: "Salary",
		},
		{
			date: new Date(2025, 0, 2),
			currency: "CHF",
			amount: -10,
			balance: 990,
			payee: "Café",
			memo: "Coffee",
		},
	];
	const csv = ynabCSV(txs);
	expect(csv).to.equal(dedent`Date,Payee,Memo,Outflow,Inflow
    2025-01-01,Money Corp,Salary,,1000.00
    2025-01-02,Café,Coffee,10.00,
    `);
});
