import type { CronJob } from 'cron'
import type { FictionEnv } from './index.js'

export class IntervalManager {
  private jobs: CronJob[] = []
  private isInitialized = false

  // Cron patterns
  private readonly patterns = {

    oneMin: '*/1 * * * *', // every 1 minute
    fiveMin: '*/5 * * * *', // Every 5 minutes
    fifteenMin: '*/15 * * * *', // 15 minutes
    hourly: '0 * * * *', // Every hour at minute 0
    daily: '0 0 * * *', // Every day at 00:00
  } as const

  constructor(private fictionEnv: FictionEnv) {
    this.initialize().catch((error) => {
      this.fictionEnv.log.error('Failed to initialize IntervalManager', { error })
    })

    this.fictionEnv.events.on('cleanup', () => this.cleanup())
  }

  private async initialize() {
    // Only initialize if we're in backend environment
    if (this.fictionEnv.isApp.value) {
      return
    }

    try {
      // Dynamically import cron only in Node environment

      await this.setupJobs()

      this.isInitialized = true
      this.logSchedule()
    }
    catch (error) {
      this.fictionEnv.log.error('Failed to load cron dependency', { error })
    }
  }

  private async setupJobs() {
    const { CronJob } = await import('cron')

    // Configure jobs with proper typing
    const jobConfigs = [
      {
        pattern: this.patterns.oneMin,
        event: 'oneMinuteInterval',
        name: '1-minute interval',
      },
      {
        pattern: this.patterns.fiveMin,
        event: 'fiveMinuteInterval',
        name: '5-minute interval',
      },
      {
        pattern: this.patterns.fifteenMin,
        event: 'fifteenMinuteInterval',
        name: '15-minute interval',
      },
      {
        pattern: this.patterns.hourly,
        event: 'hourlyInterval',
        name: 'Hourly interval',
      },
      {
        pattern: this.patterns.daily,
        event: 'dailyInterval',
        name: 'Daily interval',
      },
    ] as const

    // Create each job
    for (const config of jobConfigs) {
      const job = new CronJob<any, any>(
        config.pattern,
        () => {
          this.fictionEnv.log.debug(`Running ${config.name} task`)
          this.fictionEnv.events.emit(config.event, { reason: config.name })
        },
        null, // onComplete
        true, // start
        'UTC', // timezone
        undefined, // context
        false, // runOnInit
        undefined, // utcOffset
        true, // unrefTimeout - prevent keeping process alive
      )

      this.jobs.push(job)
    }
  }

  private logSchedule() {
    if (!this.isInitialized)
      return

    const scheduleInfo = Object.entries(this.patterns).map(([key, pattern]) => {
      const job = this.jobs.find(j => j.cronTime.source === pattern)
      const nextDate = job?.nextDate()
      return `${key}: ${nextDate?.toISO() || 'Not scheduled'}`
    })

    this.fictionEnv.log.info('Scheduled tasks initialized', {
      data: { timezone: 'UTC', nextExecutions: scheduleInfo },
    })
  }

  public cleanup() {
    this.jobs.forEach((job) => {
      job.stop()
    })
    this.jobs = []
    this.isInitialized = false
  }
}
