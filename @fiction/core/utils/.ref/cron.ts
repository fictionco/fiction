import type { CronJob as CronJobType } from 'cron'
import { log } from '../../plugin-log'

export class CronTool {
  private job?: CronJobType
  log = log.contextLogger('CRON')
  constructor(private crontab: string, private task: () => void) {
    this.startCronJob({ crontab }).catch(console.error)
  }

  // Method to start the cron job
  private async startCronJob(args: { crontab: string }) {
    const { CronJob } = await import('cron')
    const { default: cronstrue } = await import('cronstrue')

    const { crontab } = args
    this.job = new CronJob(crontab, () => {
      this.task()
    })

    this.log.info(`CRON: running task: ${cronstrue.toString(crontab)}`)

    this.job.start()
  }

  close() {
    this.job?.stop()
  }
}
