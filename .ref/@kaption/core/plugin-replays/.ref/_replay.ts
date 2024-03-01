import { hashFileName, saveToS3 } from './replay'

/**
 * Save large hashes to s3 right away
 */
export async function handleHashes({
  replayHashes,
  projectId,
}: {
  replayHashes: Record<string, string>
  projectId: string
}): Promise<void> {
  const __promises = Object.keys(replayHashes).map(async (hashKey) => {
    const hashValue = replayHashes[hashKey]

    return await saveToS3({
      fileName: hashFileName(projectId, hashKey),
      data: hashValue,
    })
  })
  await Promise.all(__promises)
}
