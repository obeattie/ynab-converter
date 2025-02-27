import RevolutLogo from "../assets/revolut.svg";
import UBSLogo from "../assets/ubs.svg";
import WiseLogo from "../assets/wise.svg";
import { readRevolutCSV } from "../readers/revolut";
import { readUBSCSV } from "../readers/ubs";
import { readWiseCSV } from "../readers/wise";
import Converter from "./Converter";

export default function AllConverters() {
  return (
    <>
      <Converter name="UBS" f={readUBSCSV} logo={UBSLogo} />
      <Converter name="Revolut" f={readRevolutCSV} logo={RevolutLogo} />
      <Converter name="Wise" f={readWiseCSV} logo={WiseLogo} />
    </>
  );
}
