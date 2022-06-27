import { EventEmitter } from "events"
import { log } from "../plugin-log"
import { _stop } from "./error"

type IndexedDbOptions = {
  version?: number
  dbName: string
  tableName: string
  indexes: { name: string }[]
}

type DataObject = {
  [key: string]: unknown
}

export class FactorIndexedDb extends EventEmitter {
  version: number
  dbName: string
  tableName: string
  initialized: Promise<void>
  db?: IDBDatabase
  keyPath: string
  indexes: { name: string }[]
  log = log.contextLogger(this.constructor.name)
  constructor(options: IndexedDbOptions) {
    super()

    if (typeof indexedDB == "undefined") {
      throw new TypeError(`indexedDB not supported`)
    }
    this.version = options.version || 1
    this.dbName = options.dbName
    this.tableName = options.tableName
    this.keyPath = "id"
    this.initialized = this.init().catch(console.error)
    this.indexes = options.indexes
  }

  async init() {
    const localDbRequest = indexedDB.open(this.dbName, this.version)

    localDbRequest.addEventListener("upgradeneeded", () => {
      const objectStore = localDbRequest.result.createObjectStore(
        this.tableName,
        {
          autoIncrement: true,
        },
      )

      this.indexes.forEach((item) => {
        objectStore.createIndex(item.name, item.name)
      })

      objectStore.transaction.addEventListener("complete", () => {})
    })

    await new Promise((resolve, reject) => {
      // these two event handlers act on the database being opened successfully, or not
      localDbRequest.addEventListener("error", (event) => {
        this.log.error("error loading", { data: { event } })
        reject(localDbRequest.result)
      })

      localDbRequest.addEventListener("success", () => {
        this.log.info("local db initialized")
        this.db = localDbRequest.result

        resolve(localDbRequest.result)
      })
    })
  }

  getObjectStore() {
    if (!this.db) throw new Error("no db available")
    const transaction = this.db?.transaction([this.tableName], "readwrite")
    return transaction?.objectStore(this.tableName)
  }

  async clearAll() {
    const objectStore = this.getObjectStore()
    return new Promise((resolve, reject) => {
      const req = objectStore.clear()
      req?.addEventListener("success", () => resolve(req.result))
      req?.addEventListener("error", () => reject(req.result))
    })
  }

  async getAll<T extends DataObject = DataObject>(): Promise<T[]> {
    const objectStore = this.getObjectStore()
    return new Promise((resolve, reject) => {
      const req = objectStore.getAll() as IDBRequest<T[]>
      req?.addEventListener("success", () => resolve(req.result))
      req?.addEventListener("error", () => reject(req.result))
    })
  }

  /**
   * Deletes multiple values by value for [key]
   * https://stackoverflow.com/questions/28635442/when-using-indexeddb-how-can-i-delete-multiple-records-using-an-index-that-is-n
   */
  async deleteByKey(params: { key: string; value: string }) {
    const { key, value } = params
    const objectStore = this.getObjectStore()

    return new Promise<number>((resolve, reject) => {
      const index = objectStore.index(key)
      const req = index.openCursor(IDBKeyRange.only(value))

      let rows = 0
      req?.addEventListener("success", () => {
        const cursor = req.result

        if (cursor) {
          rows++
          cursor.delete()
          cursor.continue()
        } else {
          // all values have been iterated
          resolve(rows)
        }
      })
      req?.addEventListener("error", () => reject(req.result))
    })
  }

  async retrieveByKey<T extends DataObject = DataObject>(params: {
    key: string
    value: string
  }): Promise<T[]> {
    const { key, value } = params
    const objectStore = this.getObjectStore()
    return new Promise((resolve, reject) => {
      const index = objectStore.index(key)
      const req = index.openCursor(IDBKeyRange.only(value))

      const rows: T[] = []
      req?.addEventListener("success", () => {
        const cursor = req.result

        if (cursor) {
          rows.push(cursor.value as T)
          cursor.continue()
        } else {
          // all values have been iterated
          resolve(rows)
        }
      })
      req?.addEventListener("error", () => reject(req.result))
    })
  }

  async insert<T extends DataObject>(data: T) {
    const objectStore = this.getObjectStore()
    return new Promise((resolve, reject) => {
      const req = objectStore.put(data)
      req?.addEventListener("success", () => resolve(req.result))
      req?.addEventListener("error", () => reject(req.result))
    })
  }
}
