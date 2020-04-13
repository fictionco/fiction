import cliProgress, { SingleBar } from "cli-progress"
import chalk from "chalk"
import { waitFor } from "@factor/api/utils"
import { emitEvent, onEvent } from "@factor/api/events"

/**
 * Create a way to alter CLI output when progress bars are building
 */
let __building = false
export const isBuilding = (): boolean => {
  return __building
}

export const setBuilding = (state: boolean): void => {
  __building = state
}

/**
 * Loading bar for the CLI
 */
export default class LoadingBar {
  bar: SingleBar
  percent = 0
  msg = ""
  build = "environment"
  addOneTimeout: NodeJS.Timeout | undefined = undefined

  constructor({ color = "", build = "" } = {}) {
    const colorize = color ? chalk.keyword(color) : (_: string): string => _
    this.bar = new cliProgress.SingleBar(
      {
        hideCursor: true,
        clearOnComplete: true,
        format: `${colorize(`{bar}`)} {percentage}% {msg}`,
      },
      cliProgress.Presets.shades_classic
    )

    if (build) this.build = build

    this.start()

    // If error elsewhere, don't iterate
    onEvent("buildError", () => {
      this.clearTimeout()
    })
  }

  start({ start = 0, finish = 100 }: { start?: number; finish?: number } = {}): void {
    this.bar.start(finish, start, { msg: this.msg })
    setBuilding(true)
    emitEvent("buildProgress", this.build, {
      progress: 0,
      message: "setting environment",
    })
  }

  async update({ percent, msg = "" }: { percent: number; msg: string }): Promise<void> {
    this.msg = msg
    percent = Math.round(percent)

    while (this.percent < percent && this.percent < 100) {
      this.addOne()
      await waitFor(20)
    }

    if (this.percent < 99) {
      this.setTimeout()
    }

    return
  }

  addOne(): void {
    this.percent = this.percent + 1

    this.bar.update(this.percent, { msg: this.msg })
    emitEvent("buildProgress", this.build, {
      progress: this.percent,
      message: this.msg,
    })

    if (this.percent >= 100) {
      this.clearTimeout()
    }
  }

  stop(): void {
    this.clearTimeout()
    setBuilding(false)
    this.bar.stop()
    emitEvent("buildProgress", this.build, {
      progress: 100,
      message: "done",
    })
  }

  clearTimeout(): void {
    if (this.addOneTimeout) {
      clearTimeout(this.addOneTimeout)
    }
  }

  setTimeout(): void {
    this.clearTimeout()
    this.addOneTimeout = setTimeout(() => {
      if (this.percent <= 99) {
        this.addOne()
        this.setTimeout()
      }
    }, 2000)
  }
}
