import { MongoMemoryServer } from "mongodb-memory-server"
import { dbInitialize, dbDisconnect } from "@factor/post/database"
import { initializeEndpointServer } from "@factor/endpoint/server"
import { createServer, closeServer } from "@factor/server"

let mongod: MongoMemoryServer

export interface MockDatabaseConfig {
  dbUrl: string
  dbPort: string
  dbPath: string
  dbName?: string
}

export const startEndpointTestingServer = async ({
  port = "",
}): Promise<MockDatabaseConfig> => {
  mongod = new MongoMemoryServer()

  const dbUrl = await mongod.getConnectionString()
  const dbPort = String(await mongod.getPort())
  const dbPath = await mongod.getDbPath()
  const dbName = await mongod.getDbName()

  process.env.DB_CONNECTION = process.env.FACTOR_DB_CONNECTION = dbUrl
  process.env.PORT = String(dbPort)
  initializeEndpointServer()
  await createServer({ port })
  await dbInitialize()

  return { dbUrl, dbPort, dbPath, dbName }
}

export const stopEndpointTestingServer = async (): Promise<void> => {
  if (mongod) await mongod.stop()

  await dbDisconnect()
  closeServer()
}
