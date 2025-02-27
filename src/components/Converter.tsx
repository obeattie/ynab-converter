import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { ImageMetadata } from "astro";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Transaction } from "../transaction";
import { ynabCSV } from "../writer";

export type ConverterF = (input: ArrayBuffer) => Promise<Transaction[]>;

export type ConverterProps = {
  name: string;
  f: ConverterF;
  logo?: ImageMetadata;
};

type Output = {
  blob: Blob;
  downloadTriggered: boolean;
};

export default function Converter(converter: ConverterProps) {
  const outputLink = useRef<HTMLAnchorElement>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      const txPromises = files.map(async (file) => {
        const input = await file.arrayBuffer();
        return await converter.f(input);
      });
      setErr(null);
      let txs: Transaction[];
      try {
        txs = (await Promise.all(txPromises)).flat();
      } catch (error) {
        setErr(String(error));
        return;
      }
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
        "rounded-md p-3 text-center relative min-h-24 shadow text-lg border transition-all flex flex-col",
        isDragAccept ? "bg-gray-200 border-gray-300" : "bg-white border-transparent hover:border-gray-300",
      )}
    >
      <div {...getRootProps()} className="absolute inset-0 cursor-pointer">
        <input {...getInputProps()} />
      </div>
      <p className="font-semibold my-auto">
        {converter.logo !== undefined ? (
          <img src={converter.logo.src} alt={converter.name} className="h-8 mx-auto" />
        ) : (
          converter.name
        )}
      </p>
      {err && (
        <p className="text-red-500 text-sm font-semibold mt-2">
          <ExclamationTriangleIcon height="1.5em" className="inline mr-2" />
          {err}
        </p>
      )}
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
