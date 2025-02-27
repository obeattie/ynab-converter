import { readRevolutCSV } from "../readers/revolut";
import { readUBSCSV } from "../readers/ubs";
import { readWiseCSV } from "../readers/wise";
import Converter from "./Converter";

export default function AllConverters() {
  return (
    <>
      <Converter name="UBS" f={readUBSCSV} />
      <Converter name="Revolut" f={readRevolutCSV} />
      <Converter name="Wise" f={readWiseCSV} />
    </>
  );
}
