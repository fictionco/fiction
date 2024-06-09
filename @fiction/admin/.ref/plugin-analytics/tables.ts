import { KaptionDbCol } from '../utils/db'
import type { BlockIp } from './types'

export const analyticsProjectColumns = [
  new KaptionDbCol({
    key: 'shouldValidateOrigin',
    create: ({ schema, column }) => schema.boolean(column.pgKey),
    isSetting: true,
    default: () => false,
  }),
  new KaptionDbCol({
    key: 'blockIps',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => [] as BlockIp[],
    prepare: ({ value }) => JSON.stringify(value),
  }),
  new KaptionDbCol({
    key: 'recordingTriggers',
    create: ({ schema, column }) =>
      schema.specificType(column.pgKey, 'text ARRAY'),
    isSetting: true,
    default: () => [] as string[],
  }),
  new KaptionDbCol({
    key: 'recordingMinimumDuration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    isSetting: true,
    default: () => 0,
  }),
] as const
