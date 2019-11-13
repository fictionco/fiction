import { MongoMemoryServer } from "mongodb-memory-server"
import { dbInitialize, dbDisconnect } from "@factor/post/database"
import { initializeEndpointServer } from "@factor/endpoint/server"
import { createEndpointServer, closeServer } from "@factor/server"
let mongod
export async function startEndpointTestingServer() {
  mongod = new MongoMemoryServer()

  const uri = await mongod.getConnectionString()
  const port = await mongod.getPort()
  const dbPath = await mongod.getDbPath()
  const dbName = await mongod.getDbName()

  process.env.DB_CONNECTION = uri

  await dbInitialize()

  initializeEndpointServer()
  await createEndpointServer({ port })

  return { uri, port, dbPath, dbName }
}

export async function stopEndpointTestingServer() {
  await mongod.stop()
  await dbDisconnect()
  await closeServer()
}
