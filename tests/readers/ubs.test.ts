import { parseISO } from "date-fns";
import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { readUBSCSV } from "../../src/readers/ubs";
import { toArrayBuffer } from "../../src/util";

test("reader", async () => {
  const contents = await readFile("tests/fixtures/ubs.csv");
  const txs = await readUBSCSV(toArrayBuffer(contents));
  expect(txs).toEqual([
    {
      date: parseISO("2025-02-25Z"),
      currency: "CHF",
      amount: 1500,
      balance: 20700,
      payee: "ACME Corp; 8000 Zurich",
      memo: "e-banking credit",
    },
    {
      date: parseISO("2025-02-25Z"),
      currency: "CHF",
      amount: -85.6,
      balance: 20581.14,
      payee: "MART CAFE             ZURICH",
      memo: "TXN 98456321; Debit card payment",
    },
    {
      date: parseISO("2025-02-25Z"),
      currency: "CHF",
      amount: -32.75,
      balance: 20666.74,
      payee: "CITY PARKING         ZURICH",
      memo: "TXN 87236498; Debit card payment",
    },
    {
      date: parseISO("2025-02-25Z"),
      currency: "CHF",
      amount: -12.45,
      balance: 20699.49,
      payee: "QUICK SHOP           BERN",
      memo: "TXN 76859431; Debit card payment",
    },
    {
      date: parseISO("2025-02-25Z"),
      currency: "CHF",
      amount: -19.5,
      balance: 20711.94,
      payee: "GAS STATION          BASEL",
      memo: "TXN 65478325; Debit card payment",
    },
  ]);
});
