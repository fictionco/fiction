import cliProgress, { SingleBar } from "cli-progress"
import chalk from "chalk"
import { waitFor } from "@factor/api/utils"

/**
 * Loading bar for the CLI
 */
export default class LoadingBar {
  bar: SingleBar
  percent = 0
  msg = ""

  constructor({ color = "cyan" } = {}) {
    const colorize = chalk.keyword(color)
    this.bar = new cliProgress.SingleBar(
      {
        hideCursor: true,
        clearOnComplete: true,
        format: `${colorize(`{bar}`)} {percentage}% {msg}`,
        noTTYOutput: true
      },
      cliProgress.Presets.shades_classic
    )

    this.start()
  }

  start({ start = 0, finish = 100 }: { start?: number; finish?: number } = {}): void {
    this.bar.start(finish, start, { msg: this.msg })
  }

  async update({ percent, msg = "" }: { percent: number; msg: string }): Promise<void> {
    this.msg = msg
    percent = Math.round(percent)
    const diff = percent - this.percent

    for (let i = 0; i < diff || percent < this.percent; i++) {
      this.percent = this.percent + 1
      this.bar.update(this.percent, { msg: this.msg })
      await waitFor(20)
    }

    return
  }

  stop(): void {
    this.bar.stop()
  }
}
