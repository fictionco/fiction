// cSpell:disable

import * as logdna from '@logdna/logger'

let __logService: logdna.Logger | undefined
export function getLogService(): {
  logService: logdna.Logger | undefined
} {
  if (!__logService) {
    const env = process.env.NODE_ENV ?? 'production'

    if (env === 'production') {
      const INGEST_KEY = '577bbe0ff4788c7ab0454645c9bdefdd'
      const opts = {
        app: 'KaptionApp',
      }
      __logService = logdna.createLogger(INGEST_KEY, opts)
    }
  }
  return { logService: __logService }
}

// log: ({ priority, data, description }): void => {
//   const { logService } = getLogService()

//   if (logService) {
//     let level = "info"
//     if (priority > 30) {
//       level = "error"
//     } else if (priority > 20) {
//       level = "warn"
//     } else if (priority > 10) {
//       level = "info"
//     } else if (priority <= 10) {
//       level = "debug"
//     }

//     let stack: string | undefined = undefined
//     if (data instanceof Error) {
//       stack = data.stack
//     }

//     const logOpts = data
//       ? {
//           meta: { data, stack },
//           level: level,
//         }
//       : undefined

//     logService.log(description, logOpts)
//   }
// },
