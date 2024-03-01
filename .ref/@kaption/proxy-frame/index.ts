import { inIFrame } from '@factor/api/utils/utils'
import { emitEvent } from '@factor/api/utils/event'
import { log } from '@factor/api/plugin-log'
import './styles.less'
import type { FrameMessage } from '@kaption/core/ui/elBrowserFrameUtil'

if (typeof window !== 'undefined' && window.process === undefined) {
  // @ts-expect-error (avoid confusion with node process.env)
  window.process = { env: {} }
}

export class KaptionProxyMessager {
  log = log.contextLogger(this.constructor.name)
  constructor() {
    if (!inIFrame())
      return

    this.log.info('[CHILD] initialize frame', {
      data: { parent: document.referrer },
    })

    window.addEventListener(
      'message',
      (event: MessageEvent<Record<string, any>>) => {
        if (event.data.from !== 'kaption')
          return

        const message = event.data as FrameMessage

        this.log.info('[CHILD] in frame event', { data: message })

        emitEvent(message.messageType, message.data)
      },
      false,
    )

    window.parent.postMessage(
      { from: 'kaption', messageType: 'frameReady', data: window.origin },
      document.referrer,
    )

    this.initialize().catch(console.error)
  }

  setup() {}

  async initialize() {
    const _promises = [import('@kaption/core/plugin-heatmaps/frame')]

    const entryFiles = (await Promise.all(_promises)) as {
      setup: () => {}
    }[]

    await Promise.all(entryFiles.map(_ => _.setup()))
  }
}

new KaptionProxyMessager()
