export function readBuffer(buf: ArrayBuffer): string {
	const dec = new TextDecoder();
	return dec.decode(buf);
}
