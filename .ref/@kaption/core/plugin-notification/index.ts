import handlebars from 'handlebars'
import type { KaptionEventOps } from '../plugin-beacon/ops'
import type { KaptionEvents } from '../plugin-events'
import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import { KaptionDbCol } from '../utils/db'

type KaptionNotificationSettings = {
  kaptionEventOps: KaptionEventOps
  kaptionEvents: KaptionEvents
} & KaptionPluginSettings

export class KaptionNotification extends KaptionPlugin<KaptionNotificationSettings> {
  factorEmail = this.settings.factorEmail
  kaptionEventOps = this.settings.kaptionEventOps
  kaptionEvents = this.settings.kaptionEvents
  constructor(settings: KaptionNotificationSettings) {
    super('notification', settings)

    // add analytics columns to kaption project table.
    this.factorDb.addColumns('kaption_usage', [
      new KaptionDbCol({
        key: 'notification',
        create: ({ schema, column }) => schema.integer(column.pgKey),
        default: () => 0,
      }),
      new KaptionDbCol({
        key: 'email',
        create: ({ schema, column }) => schema.integer(column.pgKey),
        default: () => 0,
      }),
    ])

    this.kaptionEventOps.addHook({
      hook: 'eventBatch',
      callback: async (args) => {
        const { event, events, context } = args

        const { project, organization } = context
        const projectId = project.projectId
        const organizationId = organization.organizationId

        if (events.some(e => e.isCustom)) {
          const eventConfig = await this.kaptionEvents.getEventConfig({
            _action: 'get',
            event,
            projectId,
          })

          if (!eventConfig?.isNotification)
            return

          this.log.warn('attempt notification', { data: eventConfig })

          const r = await this.kaptionEventOps.trackUsage({
            projectId,
            organizationId,
            key: 'notification',
            amount: events.length,
            limit: { day: 100, quarterHour: 15 },
          })

          if (r.status === 'error') {
            this.log.warn('usage limit error', { data: r })
            return
          }

          events.forEach(async (sessionEvent) => {
            const templateData = {
              ...eventConfig,
              ...sessionEvent,
              projectName: project.projectName || 'project',
              organizationName: organization.organizationName || 'organization',
              timestamp: this.utils.dayjs
                .unix(sessionEvent.timestamp as number)
                .tz(context.project.timezone || 'UTC')
                .format('YYYY-MM-DD HH:mm:ss'),
            }
            const subject = handlebars.compile(
              eventConfig?.notificationTitle
              || 'New event({{projectName}}): {{event}}',
            )(templateData)

            const defaultBody = `A new {{event}} was triggered:
              - anonymousId: {{anonymousId}}
              - category: {{category}}
              - label: {{label}}
              - action: {{action}}
              - value: {{value}}
              - url: {{url}}
              - timestamp: {{timestamp}}
            `

            const text = handlebars.compile(
              eventConfig?.notificationBody || defaultBody,
            )(templateData)

            const emails = eventConfig?.notificationEmail.split(',') || []

            const usageResponse = await this.kaptionEventOps.trackUsage({
              projectId,
              organizationId,
              key: 'email',
              amount: emails.length,
              limit: { day: 48, quarterHour: 5 },
            })

            this.log.warn('send email attempt', {
              data: { usageResponse, emails, subject, text },
            })

            if (usageResponse.status === 'success') {
              emails.map(async (email: string) => {
                await this.factorEmail.sendEmail({
                  to: email,
                  subject,
                  text,
                })
              })
            }
          })
        }
      },
    })
  }
}
