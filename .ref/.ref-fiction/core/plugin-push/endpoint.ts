import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorEmail,
  FactorUser,
  PushSubscriptionDetail,
  User,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import webPush from 'web-push'
import type { FictionPush, NotifyMode, PushNotification } from '.'

interface UsageQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  fictionPush: FictionPush
  factorEmail: FactorEmail
}

export abstract class QueryPush extends Query<UsageQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  fictionPush = this.settings.fictionPush
  factorEmail = this.settings.factorEmail
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }
}

interface ManagePushNotification {
  _action: 'store' | 'send' | 'remove'
  userId: string
  pushSubscription?: PushSubscriptionDetail
  notification?: PushNotification
  notifyMode?: NotifyMode
}
export class QueryManagePushNotify extends QueryPush {
  async run(
    params: ManagePushNotification,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<unknown>> {
    const {
      _action,
      pushSubscription,
      userId,
      notification,
      notifyMode = 'contextual',
    } = params

    if (!_action)
      throw this.stop('action required')
    if (!userId)
      throw this.stop('userId required')

    const db = this.factorDb.client()

    let user: User | undefined
    let message: string | undefined
    let data: unknown | undefined
    if (_action === 'send') {
      if (!notification)
        throw this.stop('notification required')

      if (
        !this.fictionPush.vapidPublicKey
        || !this.fictionPush.vapidPrivateKey
      )
        throw this.stop('VAPID keys not set')

      const q = db.select<User[]>('*').table(this.tbl.user).where({ userId })

      const [user] = await q

      if (!user || !user.pushSubscription) {
        return {
          status: 'error',
          data: 'no push subscription found',
          expose: false,
        }
      }

      // You'll need to set your VAPID keys
      webPush.setVapidDetails(
        `mailto:hello@fiction.com`,
        this.fictionPush.vapidPublicKey,
        this.fictionPush.vapidPrivateKey,
      )

      const payload = JSON.stringify({
        icon: this.fictionPush.icon,
        ...notification,
      })

      this.log.info('sending notification', {
        data: { payload, pushSubscription: user.pushSubscription },
      })
      const sendResponse = await webPush.sendNotification(
        user.pushSubscription,
        payload,
      )

      if (notifyMode === 'full') {
        await this.factorEmail.sendEmail({
          to: user.email,
          subject: `${notification.title}`,
          text: `# ${notification.title}

          ${notification.body}

          [View Details](${notification.url})

          --

          Best regards,
          The Fiction Team

          Questions? Check out the [Forum](https://forum.fiction.com)`,
        })
      }

      data = { sendResponse }
    }
    else if (_action === 'store') {
      const formattedData: Partial<User> = {
        pushSubscription,
      }

      const insertFields = this.utils.prepareFields({
        type: 'internal',
        fields: formattedData,
        meta,
        table: this.tbl.user,
        factorDb: this.factorDb,
      })

      this.log.info('push store fields', {
        data: { insertFields, formattedData },
      })
      const q = db
        .update(insertFields)
        .where({ userId })
        .table(this.tbl.user)
        .returning<User[]>('*')

      ;[user] = await q
      message = 'notifications added'

      data = { user }
    }
    else if (_action === 'remove') {
      const q = db
        .update({ pushSubscription: null })
        .where({ userId })
        .table(this.tbl.user)
        .returning<User[]>('*')

      ;[user] = await q
    }

    return {
      status: 'success',
      data,
      message,
      params,
    }
  }
}
