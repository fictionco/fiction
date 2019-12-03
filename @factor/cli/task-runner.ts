import execa from "execa"
import listr, { ListrContext, ListrTaskWrapper } from "listr"

import { log } from "@factor/tools"

interface TaskConfig {
  command: string;
  args: string[];
  title: string;
  options?: { cwd: string };
}

export async function verifyDependencies(): Promise<void> {
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

async function runTasks(t: TaskConfig[], opts = {}): Promise<void> {
  if (t.length == 0) return

  const taskMap = t.map(
    ({ title, command, args, options = { cwd: process.env.FACTOR_CWD } }) => {
      return {
        title,
        task: async (ctx: ListrContext, task: ListrTaskWrapper): Promise<void> => {
          const proc = execa(command, args, options)

          if (proc) {
            if (proc.stdout) {
              proc.stdout.on("data", data => {
                task.output = data.toString()
              })
            }
            if (proc.stderr) {
              proc.stderr.on("data", data => {
                task.output = data.toString()
              })
            }

            try {
              await proc
            } catch (error) {
              log.error(error)
            }

            task.title = `${task.title} [Done!]`

            return
          }
        }
      }
    }
  )

  const tasks = new listr(taskMap, opts)

  try {
    await tasks.run()
  } catch (error) {
    log.error(error)
  }

  return
}
