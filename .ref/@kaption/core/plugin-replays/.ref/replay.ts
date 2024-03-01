/** server-only-file */
import { _stop, logger } from '@factor/api'
import type { PutObjectCommandOutput } from '@aws-sdk/client-s3'
import type {
  S3FileOutput,
} from '@kaption/service/aws'
import {
  downloadS3,
  fileExistsS3,
  uploadS3,
} from '@kaption/service/aws'

const mimeTypeMap: Record<string, 'application/json' | 'text/css'> = {
  json: 'application/json',
  css: 'text/css',
}

export function replayFilename({
  projectId,
  replayId,
}: {
  projectId: string
  replayId: string
}): string {
  if (!projectId)
    throw _stop({ message: 'replay: projectId needed' })
  if (!replayId)
    throw _stop({ message: 'replayId needed' })

  const [partition, sessionId] = replayId.split('.')
  return `${projectId}/replays/${partition}/session-${sessionId}.json`
}

export function sessionFileName(projectId: string, sessionId: string): string {
  return `${projectId}/session/session-${sessionId}.json`
}
export function hashFileName(projectId: string, hashKey: string): string {
  return `${projectId}/hash/${hashKey}`
}
export async function saveToS3({
  fileName,
  data,
}: {
  fileName: string
  data: string
}): Promise<PutObjectCommandOutput | void> {
  const bucket = process.env.AWS_S3_BUCKET_SESSION

  if (!bucket)
    throw new Error('AWS_S3_BUCKET_SESSION var is missing')

  const exists = await fileExistsS3({ name: fileName, bucket })

  if (exists)
    return

  const extension = fileName.split('.').pop() ?? 'json'

  const mime = mimeTypeMap[extension] ?? 'application/json'

  const r = await uploadS3({
    name: fileName,
    data: Buffer.from(data, 'utf8'),
    bucket,
    mime,
    accessControl: 'private',
  })

  logger.log({ level: 'info', description: `uploaded file to s3: ${fileName}` })

  return r
}

export async function downloadReplayS3(args: {
  projectId: string
  replayId: string
}): Promise<{ session: S3FileOutput }> {
  const bucket = process.env.AWS_S3_BUCKET_SESSION

  if (!bucket)
    throw new Error('AWS_S3_BUCKET_SESSION var is missing')

  const downloads = {
    session: replayFilename(args),
  }

  const exists = await fileExistsS3({ name: downloads.session, bucket })

  if (!exists)
    throw _stop({ message: `no replay found` })

  const session = await downloadS3({
    key: downloads.session,
    bucket,
    returnString: true,
  })

  return { session }
}
