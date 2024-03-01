import type { Express } from 'express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

export function createExpress(): Express {
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.text())

  return app
}
