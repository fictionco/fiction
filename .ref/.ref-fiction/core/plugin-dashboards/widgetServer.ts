import type {
  EndpointServer,
  FactorUser,
  NodeSocketServer,
} from '@factor/api'
import {
  createSocketServer,
} from '@factor/api'

import type { WidgetServerEventMap } from './types'

export class WidgetServer {
  port: number
  socket?: NodeSocketServer<WidgetServerEventMap>
  endpointServer?: EndpointServer
  factorUser: FactorUser
  url?: string
  constructor({
    port,
    factorUser,
    url,
  }: {
    port: number
    factorUser: FactorUser
    url?: string
  }) {
    this.port = port
    this.factorUser = factorUser
    this.url = url
  }

  async create(): Promise<void> {
    const s = await createSocketServer<WidgetServerEventMap>({
      serverName: 'widgetServer',
      port: this.port,
      factorUser: this.factorUser,
      url: this.url,
    })

    this.socket = s.socketServer
    this.endpointServer = s.endpointServer
  }
}
