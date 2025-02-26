import { useToggle } from "@uidotdev/usehooks";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Transaction } from "../transaction";
import { ynabCSV } from "../writer";

export type ConverterF = (input: ArrayBufferLike) => Promise<Transaction[]>;

type ConverterProps = {
	name: string;
	f: ConverterF;
};

type Output = {
	blob: Blob;
	downloadTriggered: boolean;
};

export default function Converter(converter: ConverterProps) {
	const uploadField = useRef<HTMLInputElement>(null);
	const outputLink = useRef<HTMLAnchorElement>(null);
	const [output, setOutput] = useState<Output | null>(null);
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
		setOutput({
			blob: new Blob([output], { type: "text/csv" }),
			downloadTriggered: false,
		});
	}, [converter]);

	// If there's a file ready to download and it hasn't been auto-downloaded, click the link
	useEffect(() => {
		if (output && !output.downloadTriggered && outputLink.current) {
			outputLink.current.click();
			setOutput({ ...output, downloadTriggered: true });
		}
	}, [output]);

	return (
		<div
			data-converter={converter.name}
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
				data-testid="input-upload"
			/>
			<p className="font-bold w-full my-auto">{converter.name}</p>
			{output && (
				<a
					ref={outputLink}
					href={output ? URL.createObjectURL(output.blob) : "#"}
					download={`transactions-${converter.name.toLowerCase()}.csv`}
					className="hidden"
					data-testid="output-download"
				>
					Download output
				</a>
			)}
		</div>
	);
}
