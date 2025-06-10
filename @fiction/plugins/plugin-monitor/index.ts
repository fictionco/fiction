import type { FictionApp, FictionAppEntry, FictionEmail, FictionEnv, FictionUser, Organization, User } from '@fiction/core'
import { EnvVar, FictionPlugin, isActualBrowser, isTest, vars } from '@fiction/core'

declare global {
  interface Window {
    __ls?: any
    mixpanel?: any
    amplitude?: any
  }
}

vars.register(() => [
  new EnvVar({ name: 'SLACK_WEBHOOK_URL', isPublic: false, isOptional: true }),
  new EnvVar({ name: 'DISCORD_WEBHOOK_URL', isPublic: false, isOptional: true }),
  new EnvVar({ name: 'SENTRY_PUBLIC_DSN', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'MIXPANEL_TOKEN', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'MIXPANEL_API_SECRET', isPublic: false, isOptional: true }),
  new EnvVar({ name: 'AMPLITUDE_API_KEY', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'AMPLITUDE_SECRET_KEY', isPublic: false, isOptional: true }),
  new EnvVar({ name: 'MONITOR_EMAIL', isPublic: false, isOptional: true }),
])

interface FictionMonitorSettings {
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionApp: FictionApp
  fictionEmail: FictionEmail
  slackWebhookUrl?: string
  discordWebhookUrl?: string
  sentryPublicDsn?: string
  mixpanelToken?: string
  amplitudeApiKey?: string
  monitorEmail?: string
  enableSessionReplay?: boolean
  sessionReplaySampleRate?: number
}

export class FictionMonitor extends FictionPlugin<FictionMonitorSettings> {
  private isEnabled = !isTest() && this.settings.fictionEnv?.isProd.value

  constructor(settings: FictionMonitorSettings) {
    super('FictionMonitor', settings)

    if (!this.isEnabled)
      return

    // User events
    settings.fictionUser.hooks.on('currentUser', 'monitor:currentUser', ({ user }) => this.identifyUser(user))
    settings.fictionUser.hooks.on('newUserOnboarded', 'monitor:newUserOnboarded', ({ user, org }) => this.handleNewUser({ user, org }))

    // Browser monitoring
    settings.fictionApp.hooks.on('beforeAppMounted', 'monitoring', ({ entry }) => this.setupBrowser(entry))
  }

  private async handleNewUser(args: { user?: User, org?: Organization }): Promise<void> {
    const { user, org } = args
    if (this.settings.fictionEnv?.isApp.value || user?.email?.includes('test') || user?.email?.includes('fiction.com'))
      return

    const { cityName, regionName, countryCode } = user?.geo || {}
    const userData = {
      name: user?.fullName || 'No Name',
      verified: user?.emailVerified ? 'Yes' : 'No',
      location: [cityName, regionName, countryCode].filter(Boolean).join(', ') || 'Unknown',
      clout: org?.profile?.clout || 0,
      email: org?.email || user?.email,
      summary: org?.profile?.summary || 'No summary',
      handle: org?.handle || user?.handle || 'No Handle',
    }

    await this.notify({
      message: `🎉 New user: ${user?.email} - ${org?.name}`,
      data: userData,
    })

    this.track('user_onboarded', {
      name: org?.name,
      userId: user?.userId,
      email: user?.email,
      verified: user?.emailVerified,
      organizationId: org?.orgId,
    })
  }

  async notify(args: { message: string, data?: Record<string, unknown> }): Promise<void> {
    if (isActualBrowser())
      return

    const { message, data } = args
    const promises: Promise<void>[] = []

    if (this.settings.slackWebhookUrl)
      promises.push(this.sendSlack(message, data))
    if (this.settings.discordWebhookUrl)
      promises.push(this.sendDiscord(message, data))

    await Promise.allSettled(promises)
  }

  private async sendSlack(message: string, data?: Record<string, unknown>): Promise<void> {
    try {
      const { IncomingWebhook } = await import('@slack/webhook')
      const webhook = new IncomingWebhook(this.settings.slackWebhookUrl!)

      const attachments = data
        ? [{
            fields: Object.entries(data).map(([title, value]) => ({ title, value: String(value), short: true })),
            ts: String(Math.floor(Date.now() / 1000)),
          }]
        : undefined

      await webhook.send({ text: message, attachments })
    }
    catch (error) {
      this.log.error('Slack notification failed:', error)
    }
  }

  private async sendDiscord(message: string, data?: Record<string, unknown>): Promise<void> {
    try {
      const embed = {
        title: message,
        color: 0x2DCE89,
        fields: data ? Object.entries(data).map(([name, value]) => ({ name, value: String(value), inline: true })) : undefined,
        timestamp: new Date().toISOString(),
      }

      await fetch(this.settings.discordWebhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      })
    }
    catch (error) {
      this.log.error('Discord notification failed:', error)
    }
  }

  private async setupBrowser(entry: FictionAppEntry): Promise<void> {
    if (window !== window.top)
      return

    const promises: Promise<void>[] = []

    if (this.settings.sentryPublicDsn)
      promises.push(this.setupSentry(entry.app))
    if (this.settings.mixpanelToken)
      promises.push(this.setupMixpanel())
    if (this.settings.amplitudeApiKey)
      promises.push(this.setupAmplitude())

    await Promise.allSettled(promises)
  }

  private async setupSentry(app: any): Promise<void> {
    try {
      const Sentry = await import('@sentry/vue')
      Sentry.init({
        app,
        dsn: this.settings.sentryPublicDsn!,
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        tracesSampleRate: this.settings.fictionEnv?.isProd.value ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })
    }
    catch (error) {
      this.log.error('Sentry setup failed:', { error })
    }
  }

  private async setupMixpanel(): Promise<void> {
    try {
      const { default: mixpanel } = await import('mixpanel-browser')
      mixpanel.init(this.settings.mixpanelToken!, {
        debug: !this.settings.fictionEnv?.isProd.value,
        autocapture: true,
        track_pageview: true,
        persistence: 'localStorage',
      })
      window.mixpanel = mixpanel
    }
    catch (error) {
      this.log.error('Mixpanel setup failed:', error)
    }
  }

  private async setupAmplitude(): Promise<void> {
    try {
      const amplitude = await import('@amplitude/analytics-browser')

      // Initialize Amplitude with configuration
      amplitude.init(this.settings.amplitudeApiKey!, {
        autocapture: {
          sessions: true,
          pageViews: true,
          elementInteractions: true,
        },
        defaultTracking: {
          sessions: true,
          pageViews: true,
        },
        serverZone: 'US',
      })

      // Setup Session Replay if enabled
      if (this.settings.enableSessionReplay) {
        await this.setupAmplitudeSessionReplay(amplitude)
      }

      window.amplitude = amplitude
    }
    catch (error) {
      this.log.error('Amplitude setup failed:', { error })
    }
  }

  private async setupAmplitudeSessionReplay(amplitude: any): Promise<void> {
    try {
      const { sessionReplayPlugin } = await import('@amplitude/plugin-session-replay-browser')

      const sessionReplayTracking = sessionReplayPlugin({
        sampleRate: this.settings.sessionReplaySampleRate || (this.settings.fictionEnv?.isProd.value ? 0.1 : 1.0),
        privacyConfig: {
          defaultMaskLevel: 'light',
        },
        debugMode: !this.settings.fictionEnv?.isProd.value,
        forceSessionTracking: true,
      })

      amplitude.add(sessionReplayTracking)
    }
    catch (error) {
      this.log.error('Amplitude Session Replay setup failed:', error)
    }
  }

  async identifyUser(user?: User): Promise<void> {
    if (!user?.email || typeof window === 'undefined' || window !== window.top)
      return

    const userProps = {
      name: user.fullName || 'No Name',
      email: user.email,
      userId: user.userId,
      verified: user.emailVerified || false,
      lastSeenAt: user.lastSeenAt,
    }

    // LiveSession
    window.__ls?.('identify', userProps)

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(user.userId)
      window.mixpanel.people.set(userProps)
    }

    // Amplitude
    if (window.amplitude) {
      window.amplitude.setUserId(user.userId)
      window.amplitude.identify({
        user_properties: userProps,
      })
    }

    // Sentry
    if (this.settings.sentryPublicDsn) {
      const Sentry = await import('@sentry/vue')
      Sentry.setUser({
        id: user.userId,
        email: user.email,
        username: user.fullName,
      })
    }
  }

  track(event: string, properties?: Record<string, unknown>): void {
    if (!this.isEnabled || typeof window === 'undefined')
      return

    const eventProperties = {
      timestamp: new Date().toISOString(),
      ...properties,
    }

    // Mixpanel tracking
    window.mixpanel?.track(event, eventProperties)

    // Amplitude tracking
    window.amplitude?.track(event, eventProperties)
  }

  page(args: { name?: string, category?: string, properties?: Record<string, unknown> } = {}): void {
    if (!this.isEnabled || typeof window === 'undefined')
      return

    const { name, category, properties = {} } = args
    const pageProperties = {
      timestamp: new Date().toISOString(),
      page_name: name || document.title,
      page_category: category,
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer,
      ...properties,
    }

    // Mixpanel page tracking
    window.mixpanel?.track('Page View', pageProperties)

    // Amplitude page tracking (handled automatically by autocapture)
    window.amplitude?.track('Page View', pageProperties)
  }
}
