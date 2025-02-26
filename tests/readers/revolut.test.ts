import { parseISO } from "date-fns";
import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { readRevolutCSV } from "../../src/readers/revolut";
import { toArrayBuffer } from "../../src/util";

test("reader", async () => {
  const contents = await readFile("tests/fixtures/revolut.csv");
  const txs = await readRevolutCSV(toArrayBuffer(contents));
  expect(txs).toEqual([
    {
      date: parseISO("2025-02-20T08:15:30.000Z"),
      currency: "CHF",
      amount: 900,
      balance: 1100.5,
      payee: "Payment from John Doe A/o",
    },
    {
      date: parseISO("2025-02-22T09:30:10.000Z"),
      currency: "CHF",
      amount: -4.5,
      balance: 1096,
      payee: "Coffee House Zurich",
    },
    {
      date: parseISO("2025-02-23T12:20:45.000Z"),
      currency: "CHF",
      amount: -45.3,
      balance: 1050.7,
      payee: "Supermarket Bern",
    },
    {
      date: parseISO("2025-02-24T14:15:30.000Z"),
      currency: "CHF",
      amount: -85,
      balance: 965.7,
      payee: "Fuel Station Geneva",
    },
    {
      date: parseISO("2025-02-25T10:50:22.000Z"),
      currency: "CHF",
      amount: -32.75,
      balance: 932.95,
      payee: "Online Bookstore",
    },
  ]);
});
