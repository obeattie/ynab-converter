import { parseISO } from "date-fns";
import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { readWiseCSV } from "../../src/readers/wise";
import { toArrayBuffer } from "../../src/util";

test("reader", async () => {
  const contents = await readFile("tests/fixtures/wise.csv");
  const txs = await readWiseCSV(toArrayBuffer(contents));
  expect(txs).toEqual([
    {
      amount: 2000,
      balance: 3500.75,
      currency: "CHF",
      date: parseISO("2025-02-20Z"),
      memo: "Salary Payment from ACME Corp",
      payee: "ACME Corp",
    },
    {
      amount: -52.4,
      balance: 3498.35,
      currency: "CHF",
      date: parseISO("2025-02-21Z"),
      memo: "Card transaction of 54.80 EUR issued by Bistro Cafe Zurich",
      payee: "Bistro Cafe Zurich",
    },
    {
      amount: -120.9,
      balance: 3417.45,
      currency: "CHF",
      date: parseISO("2025-02-22Z"),
      memo: "Card transaction of 130.00 EUR issued by Alpine Gear Bern",
      payee: "Alpine Gear Bern",
    },
    {
      amount: -8.75,
      balance: 3408.7,
      currency: "CHF",
      date: parseISO("2025-02-23Z"),
      memo: "Card transaction of 9.50 EUR issued by Train Station Kiosk Geneva",
      payee: "Train Station Kiosk Geneva",
    },
    {
      amount: -27,
      balance: 3381.7,
      currency: "CHF",
      date: parseISO("2025-02-24Z"),
      memo: "Card transaction of 29.00 EUR issued by Gas Station Basel",
      payee: "Gas Station Basel",
    },
  ]);
});
