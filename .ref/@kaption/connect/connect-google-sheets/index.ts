import { OAuth2Client } from 'google-auth-library'
import { EnvVar, vars } from '@factor/api/plugin-env'
import { InputOption } from '@kaption/core/utils/inputOption'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type {
  IntegrationClientDetail,
  IntegrationMode,
} from '../connection'
import {
  AuthHandler,
  KaptionConnection,
} from '../connection'
import type { IntegrationRow } from '../plugin-integrations/tables'
import logo from './logo.svg'

const clientIdKey = 'INTEGRATION_GOOGLE_SHEETS_CLIENT_ID'
const clientSecretKey = 'INTEGRATION_GOOGLE_SHEETS_CLIENT_SECRET'
vars.register(() => [
  new EnvVar({
    name: clientIdKey,
    val: process.env[clientIdKey],
  }),
  new EnvVar({
    name: clientSecretKey,
    val: process.env[clientSecretKey],
  }),
])

export class ConnectGoogleSheets extends KaptionConnection {
  clientId = this.settings.factorEnv.var(clientIdKey)
  clientSecret = this.settings.factorEnv.var(clientSecretKey)
  projectId = this.settings.projectId
  key = 'googleSheets' as const
  name = 'Google Sheets'

  description
    = 'Send your data straight to Google Sheets. Syncs as results come in.'

  logo = logo

  supports: IntegrationMode[] = ['table']

  auth = new AuthHandler({
    authType: 'oauth2' as const,
    tokenUrl:
      'https://www.googleapis.com/oauth2/v4/token?grant_type=authorization_code',
    authorizationUrl:
      'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    scope:
      'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
    clientId: this.clientId,
    clientSecret: this.clientSecret,
  })

  constructor(settings: IntegrationClientDetail) {
    super('ConnectGoogleSheets', settings)
  }

  opts = this.utils.vue.computed<InputOption<keyof IntegrationRow | string>[]>(
    () => {
      const state = this.connectionState.value

      return [
        this.getOAuthOption(),
        new InputOption({
          label: 'Destination',
          optionKey: 'destination',
          input: 'InputSelect',
          props: this.utils.vue.computed(() => {
            return {
              list: [
                { name: 'Create new document', value: 'create' },
                { name: 'Existing document', value: 'existing' },
              ],
            }
          }),
          category: 'handling',
          isVisible: this.utils.vue.computed(() => !!state.oAuthPayload),
        }),
        new InputOption({
          label: 'Spreadsheet ID',
          description: 'Get the spreadsheet ID from the document URL',
          optionKey: 'channelId',
          input: 'InputText',
          category: 'handling',
          isVisible: this.utils.vue.computed(
            () => state.destination === 'existing' && !!state.oAuthPayload,
          ),
        }),
        new InputOption({
          label: 'New Spreadsheet Name',
          optionKey: 'channelName',
          input: 'InputText',
          category: 'handling',
          isVisible: this.utils.vue.computed(
            () => state.destination === 'create' && !!state.oAuthPayload,
          ),
        }),
      ]
    },
  )

  hasRequiredDetails = this.utils.vue.computed(() => {
    const state = this.connectionState.value
    const hasDestination
      = state.destination === 'existing' ? !!state.channelId : !!state.channelName

    return hasDestination && !!state.oAuthPayload
  })

  getAuth() {
    const state = this.connectionState.value

    if (!state.oAuthPayload?.accessToken || !state.oAuthPayload?.refreshToken)
      throw new Error('missing authorization credentials')

    const auth = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    })

    const payload = state.oAuthPayload

    auth.setCredentials({
      access_token: payload.accessToken,
      refresh_token: payload.refreshToken,
      scope: payload.scope,
      token_type: payload.tokenType || 'Bearer',
      expiry_date: 1_469_787_756_005,
    })

    return auth
  }

  async activate(): Promise<Partial<IntegrationRow>> {
    const state = this.connectionState.value

    const auth = this.getAuth()

    const spreadsheetTitle = state.channelName || 'Kaption'
    const sheetTitle = state.listName || 'List'
    let doc: GoogleSpreadsheet
    if (state.destination === 'create' && spreadsheetTitle) {
      doc = new GoogleSpreadsheet()
      doc.useOAuth2Client(auth)

      await doc.createNewSpreadsheetDocument({ title: spreadsheetTitle })
    }
    else if (state.destination === 'existing' && state.channelId) {
      doc = new GoogleSpreadsheet(state.channelId)
      doc.useOAuth2Client(auth)
    }
    else {
      throw new Error('missing destination')
    }

    await doc.loadInfo()

    state.channelId = doc.spreadsheetId || undefined

    const sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: state.columns,
      index: 0,
    })

    this.log.debug('sheetData', { data: { sheets: doc.sheetsByTitle } })

    state.listId = sheet.sheetId
    state.listName = sheet.title

    this.connectionState.value = state

    return this.connectionState.value
  }
}
