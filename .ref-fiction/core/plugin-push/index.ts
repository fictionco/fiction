// @unocss-include

import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  PushSubscriptionDetail,
} from '@factor/api'
import {
  EnvVar,
  FactorPlugin,
  vars,
} from '@factor/api'

import type { FactorCache } from '@factor/api/plugin-cache'
import fictionIcon from '../img/icon.png'
import { QueryManagePushNotify } from './endpoint'

vars.register(() => [
  new EnvVar({
    name: 'VAPID_PUBLIC_KEY',
    isPublic: true,
  }),
  new EnvVar({
    name: 'VAPID_PRIVATE_KEY',
    isPublic: false,
  }),
])

export interface PushNotification {
  title: string
  body: string
  icon?: string
  url?: string
}

export type NotifyMode = 'full' | 'contextual' | ''

export type FictionPushSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorEmail: FactorEmail
  factorCache: FactorCache
  vapidPublicKey?: string
  vapidPrivateKey?: string
} & FactorPluginSettings

export class FictionPush extends FactorPlugin<FictionPushSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorCache = this.settings.factorCache
  factorEmail = this.settings.factorEmail
  vapidPublicKey = this.settings.vapidPublicKey
  vapidPrivateKey = this.settings.vapidPrivateKey
  icon = fictionIcon
  cache = () => this.factorCache.getCache()
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: FictionPushSettings) {
    super('FictionPush', settings)
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        return await navigator.serviceWorker.register('/sw-push.js')
      }
      catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  async serverSend(args: {
    notification: PushNotification
    notifyMode?: NotifyMode
  }) {
    const { notification, notifyMode = 'contextual' } = args
    const userId = this.factorUser.activeUser.value?.userId
    if (!userId)
      return
    const r = await this.queries.ManagePushNotify.serve(
      {
        _action: 'send',
        userId,
        notification,
        notifyMode,
      },
      { server: true },
    )

    return r
  }

  async unsubscribeUserFromPush() {
    const registration = await this.registerServiceWorker()
    const userId = this.factorUser.activeUser.value?.userId

    this.log.info('unsubscribing', { data: { registration, userId } })

    if (!userId)
      return

    if (registration) {
      const existingSubscription
        = await registration.pushManager.getSubscription()

      if (existingSubscription) {
        try {
          // Unsubscribe the user from the push subscription
          await existingSubscription.unsubscribe()
          // Remove the subscription information from your server
          await this.requests.ManagePushNotify.request({
            _action: 'remove',
            userId,
          })
        }
        catch (error) {
          this.log.error('failed to unsubscribe', { error })
        }
      }
    }
  }

  async subscribeUserToPush() {
    const registration = await this.registerServiceWorker()
    const userId = this.factorUser.activeUser.value?.userId

    this.log.info('result', { data: { registration, userId } })

    if (!userId)
      return

    if (registration) {
      const existingSubscription
        = await registration.pushManager.getSubscription()

      if (!existingSubscription) {
        try {
          const publicVapidKey = this.vapidPublicKey
          if (!publicVapidKey)
            throw new Error('VAPID_PUBLIC_KEY not set')
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey,
          })

          this.log.info('user push subscription', { data: { subscription } })

          await this.requests.ManagePushNotify.request({
            _action: 'store',
            pushSubscription: subscription as PushSubscriptionDetail,
            userId,
          })
        }
        catch (error) {
          this.log.error('failed subscribe', { error })
        }
      }
    }
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
      fictionPush: this,
    }
    return { ManagePushNotify: new QueryManagePushNotify(deps) } as const
  }
}
