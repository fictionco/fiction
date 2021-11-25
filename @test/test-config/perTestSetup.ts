import fs from "fs-extra"
import * as http from "http"
import path from "path"
import slash from "slash"
import sirv from "sirv"
import { createServer, build, ViteDevServer, UserConfig } from "vite"
import { Page, ConsoleMessage } from "playwright-chromium"

const isBuildTest = !!process.env.VITE_TEST_BUILD

// injected by the test env
declare global {
  namespace NodeJS {
    interface Global {
      page?: Page
      factorTestUrl?: string
    }
  }
}

declare global {
  namespace globalThis {
    export const page: Page
  }
  interface globalThis {
    page: Page
  }
}

let server: ViteDevServer | http.Server
let tempDir: string
let __err: Error

const logs: string[] = ((global as any).browserLogs = [])

const onConsole = (msg: ConsoleMessage): void => {
  logs.push(msg.text())
}

const startStaticServer = (): Promise<string> => {
  // start static file server
  const serve = sirv(path.resolve(tempDir, "dist"))
  const httpServer = (server = http.createServer((req, res) => {
    if (req.url === "/ping") {
      res.statusCode = 200
      res.end("pong")
    } else {
      serve(req, res)
    }
  }))
  let port = 5000
  return new Promise((resolve, reject) => {
    const onError = (e: any): void => {
      if (e.code === "EADDRINUSE") {
        httpServer.close()
        httpServer.listen(++port)
      } else {
        reject(e)
      }
    }
    httpServer.on("error", onError)
    httpServer.listen(port, () => {
      httpServer.removeListener("error", onError)
      resolve(`http://localhost:${port}`)
    })
  })
}

beforeAll(async () => {
  try {
    page.on("console", onConsole)

    // path to the spec file
    const testPath = expect.getState().testPath

    // what is the name of the test, retrieved from file namet
    const testName = slash(testPath).match(/playground\/([\w-]+)\//)?.[1]

    // if this is a test placed under playground/xxx/__tests__
    // start a vite server in that directory.
    if (testName) {
      const playgroundRoot = path.dirname(require.resolve("@factor/playground"))
      const srcDir = path.resolve(playgroundRoot, testName)
      tempDir = path.resolve(__dirname, "../temp", testName)
      await fs.copy(srcDir, tempDir, {
        dereference: true,
        filter(file) {
          file = slash(file)
          return (
            !file.includes("__tests__") &&
            !file.includes("node_modules") &&
            !/dist(\/|$)/.test(file)
          )
        },
      })

      const testCustomServe = path.resolve(path.dirname(testPath), "serve.js")
      if (fs.existsSync(testCustomServe)) {
        // test has custom server configuration.
        const { serve } = require(testCustomServe)
        server = await serve(tempDir, isBuildTest)
        return
      }

      const options: UserConfig = {
        root: tempDir,
        logLevel: "error",
        server: {
          watch: {
            // During tests we edit the files too fast and sometimes chokidar
            // misses change events, so enforce polling for consistency
            usePolling: true,
            interval: 100,
          },
        },
        build: {
          // skip transpilation and dynamic import polyfills during tests to
          // make it faster
          target: "esnext",
        },
      }

      if (!isBuildTest) {
        process.env.VITE_INLINE = "inline-serve"
        const inst = await createServer(options)
        server = await inst.listen()
        // use resolved port/base from server
        const url = `http://localhost:${server.config.server.port}`
        await page.goto(url)
      } else {
        process.env.VITE_INLINE = "inline-build"
        await build(options)
        const url = await startStaticServer()
        await page.goto(url)
      }
    }
  } catch (error: any) {
    // jest doesn't exit if our setup has error here
    // https://github.com/facebook/jest/issues/2713
    __err = error
  }
}, 30_000)

afterAll(async () => {
  if (server) {
    await server.close()
  }
  if (__err) {
    throw __err
  }
})
