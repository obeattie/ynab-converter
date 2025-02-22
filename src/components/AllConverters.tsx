import { readRevolutCSV } from "../readers/revolut";
import { readUBSCSV } from "../readers/ubs";
import { readWiseCSV } from "../readers/wise";
import Converter from "./Converter";

const converters = {
	UBS: readUBSCSV,
	Revolut: readRevolutCSV,
	Wise: readWiseCSV,
};

export default function AllConverters() {
	return (
		<>
			{Object.entries(converters).map(([name, f]) => (
				<Converter key={name} name={name} f={f} />
			))}
		</>
	);
}
