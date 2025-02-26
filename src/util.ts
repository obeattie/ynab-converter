export function readBuffer(buf: ArrayBuffer): string {
  const dec = new TextDecoder();
  return dec.decode(buf);
}

export function toArrayBuffer(x: ArrayBuffer | Buffer): ArrayBuffer {
  return new Uint8Array(x).buffer;
}
