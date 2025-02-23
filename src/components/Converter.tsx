import { useToggle } from "@uidotdev/usehooks";
import classNames from "classnames";
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
	const [isDragging, toggleDragging] = useToggle();

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
		<div
			className={classNames(
				"rounded-md text-slate-100 p-3 text-center relative min-h-24 flex",
				isDragging ? "bg-slate-500" : "bg-slate-800",
			)}
		>
			<input
				type="file"
				accept="text/csv"
				onChange={onChange}
				onDragEnter={(e) => toggleDragging(true)}
				onDragLeave={() => toggleDragging(false)}
				onDrop={() => toggleDragging(false)}
				ref={uploadField}
				className="absolute inset-0 opacity-0"
			/>
			<p className="font-bold w-full my-auto">{converter.name}</p>
			{output && (
				<a
					ref={outputLink}
					href={output ? URL.createObjectURL(output) : "#"}
					download={
						output && `transactions-${converter.name.toLowerCase()}.csv`
					}
					className="hidden"
				>
					Download output
				</a>
			)}
		</div>
	);
}
