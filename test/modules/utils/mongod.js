import { MongoMemoryServer } from "mongodb-memory-server"
import { dbInitialize, dbDisconnect } from "@factor/post/database"
import { initializeEndpointServer } from "@factor/endpoint/server"
import { createServer, closeServer } from "@factor/server"
let mongod
export async function startEndpointTestingServer({ port, debug = false }) {
  mongod = new MongoMemoryServer({ debug })

  const dbUrl = await mongod.getConnectionString()
  const dbPort = await mongod.getPort()
  const dbPath = await mongod.getDbPath()
  const dbName = await mongod.getDbName()

  process.env.DB_CONNECTION = dbUrl
  initializeEndpointServer()
  await createServer({ port })
  await dbInitialize()

  return { dbUrl, dbPort, dbPath, dbName }
}

export async function stopEndpointTestingServer() {
  if (mongod) await mongod.stop()

  await dbDisconnect()
  closeServer()
}
