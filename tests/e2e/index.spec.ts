import test, { expect } from "@playwright/test";
import { parse } from "csv-parse/sync";
import { readFile } from "node:fs/promises";

test("converts file", async ({ page }) => {
	await page.goto("/");
	const input = page.locator('[data-converter="UBS"] > input');
	await expect(input).toBeVisible();
	const downloadPromise = page.waitForEvent("download");
	await input.setInputFiles("testdata/ubs.csv");
	const download = await downloadPromise;
	const contents = await readFile(await download.path());
	const parsed: string[][] = parse(contents);
	expect(parsed).toHaveLength(5 + 1); // 5 rows + 1 header
	expect(parsed[0]).toEqual(["Date", "Payee", "Memo", "Outflow", "Inflow"]); // headers
});
