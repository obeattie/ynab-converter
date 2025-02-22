import { useCallback, useEffect, useRef, useState } from "react";
import type { Transaction } from "../transaction";
import { ynabCSV } from "../writer";

type ConvertWidgetProps = {
	name: string;
	f: (input: ArrayBuffer) => Promise<Transaction[]>;
};

export default function Converter(converter: ConvertWidgetProps) {
	const uploadField = useRef<HTMLInputElement>(null);
	const outputLink = useRef<HTMLAnchorElement>(null);
	const [output, setOutput] = useState<Blob | null>(null);

	const onChange = useCallback(async () => {
		if (!uploadField.current?.files) return;

		const txPromises = Array.from(uploadField.current.files).map(
			async (file) => {
				const input = await file.arrayBuffer();
				return await converter.f(input);
			},
		);
		const txs = (await Promise.all(txPromises)).flat();
		const output = ynabCSV(txs);
		setOutput(new Blob([output], { type: "text/csv" }));
	}, [converter]);

	// If there's a file ready to download, click the link to make it download and then clear it
	useEffect(() => {
		if (output && outputLink.current) {
			outputLink.current.click();
			setOutput(null);
		}
	}, [output]);

	return (
		<div className="rounded-md bg-slate-800 text-slate-100 p-3 text-center">
			<input
				type="file"
				accept="text/csv"
				onChange={onChange}
				ref={uploadField}
			/>
			<p className="font-bold">{converter.name}</p>
			{output && (
				// biome-ignore lint/a11y/useAnchorContent: this is never seen
				<a
					ref={outputLink}
					href={output ? URL.createObjectURL(output) : "#"}
					download={
						output && `transactions-${converter.name.toLowerCase()}.csv`
					}
					className="hidden"
				/>
			)}
		</div>
	);
}
