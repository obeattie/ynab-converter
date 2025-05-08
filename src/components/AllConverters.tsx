import RevolutLogo from "../assets/revolut.svg";
import UBSLogo from "../assets/ubs.svg";
import WiseLogo from "../assets/wise.svg";
import ZKBLogo from "../assets/zkb.svg";
import { readRevolutCSV } from "../readers/revolut";
import { readUBSCSV } from "../readers/ubs";
import { readWiseCSV } from "../readers/wise";
import { readZKBCSV } from "../readers/zkb";
import Converter from "./Converter";

export default function AllConverters() {
  return (
    <>
      <Converter name="Revolut" f={readRevolutCSV} logo={RevolutLogo} />
      <Converter name="UBS" f={readUBSCSV} logo={UBSLogo} />
      <Converter name="Wise" f={readWiseCSV} logo={WiseLogo} />
      <Converter name="Zürcher Kantonalbank" f={readZKBCSV} logo={ZKBLogo} />
    </>
  );
}
