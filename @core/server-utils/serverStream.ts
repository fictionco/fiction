export const streamToString = async (
  stream?: NodeJS.ReadableStream,
): Promise<string> => {
  if (!stream) return ""
  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err: Error) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}
