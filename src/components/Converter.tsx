import { useCallback, useRef } from "react";
import type { Transaction } from "../transaction";
import { ynabCSV } from "../writer";

type ConvertWidgetProps = {
	name: string;
	f: (input: ArrayBuffer) => Promise<Transaction[]>;
};

export default function Converter(converter: ConvertWidgetProps) {
	const uploadField = useRef<HTMLInputElement>(null);
	const onChange = useCallback(async () => {
		if (!uploadField.current?.files) return;
		for (const file of uploadField.current.files) {
			const csv = await file.arrayBuffer();
			const txs = await converter.f(csv);
			console.log(ynabCSV(txs));
		}
	}, [converter]);

	return (
		<div className="rounded-md bg-slate-800 text-slate-100 p-3 text-center">
			<input
				type="file"
				accept="text/csv"
				onChange={onChange}
				ref={uploadField}
			/>
			<p className="font-bold">{converter.name}</p>
		</div>
	);
}
