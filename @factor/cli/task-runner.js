import execa from "execa"
import listr from "listr"

export async function verifyDependencies() {
  await runTasks(
    [
      { command: "yarn", args: ["install"], title: "Verify Dependencies" },
      {
        command: "factor",
        args: ["create-loaders"],
        title: "Verify Extensions"
      }
    ],
    { exitOnError: true }
  )
}

async function runTasks(t, opts = {}) {
  if (t.length == 0) return

  // Don't log during tests
  if (process.env.FACTOR_ENV == "test") opts.renderer = "silent"

  const taskMap = t.map(
    ({
      title,
      command,
      args,
      options = { cwd: process.env.FACTOR_CWD, done: false, output: false }
    }) => {
      return {
        title,
        task: async (ctx, task) => {
          if (typeof command == "function") {
            return await command(ctx, task)
          } else {
            const proc = execa(command, args, options)

            if (proc) {
              proc.stdout.on("data", data => {
                task.output = data.toString()
              })

              proc.stderr.on("data", data => {
                task.output = data.toString()
              })

              try {
                await proc
              } catch (error) {
                log.error(error)
              }

              task.title = options.done ? options.done : `${task.title} [Done!]`

              return
            }
          }
        }
      }
    }
  )

  const tasks = new listr(taskMap, opts)

  await tasks.run()

  return
}
