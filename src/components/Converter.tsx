import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Transaction } from "../transaction";
import { ynabCSV } from "../writer";

export type ConverterF = (input: ArrayBuffer) => Promise<Transaction[]>;

export type ConverterProps = {
  name: string;
  f: ConverterF;
};

type Output = {
  blob: Blob;
  downloadTriggered: boolean;
};

export default function Converter(converter: ConverterProps) {
  const outputLink = useRef<HTMLAnchorElement>(null);
  const [output, setOutput] = useState<Output | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      const txPromises = files.map(async (file) => {
        const input = await file.arrayBuffer();
        return await converter.f(input);
      });
      const txs = (await Promise.all(txPromises)).flat();
      const output = ynabCSV(txs);
      setOutput({
        blob: new Blob([output], { type: "text/csv" }),
        downloadTriggered: false,
      });
    },
    [converter],
  );
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({ onDrop });

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
        "rounded-md p-3 text-center relative min-h-24 flex shadow text-lg border transition-all",
        isDragAccept ? "bg-gray-200 border-gray-300" : "bg-white border-transparent hover:border-gray-300",
      )}
    >
      <div {...getRootProps()} className="absolute inset-0 cursor-pointer">
        <input {...getInputProps()} />
      </div>
      <p className="font-semibold w-full my-auto">{converter.name}</p>
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
