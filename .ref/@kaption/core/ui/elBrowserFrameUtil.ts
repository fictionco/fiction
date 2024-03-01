import { waitFor } from '@factor/api/utils'
import { vue } from '@factor/api/utils/libraries'
import { FactorObject } from '@factor/api/plugin'

export interface FrameMessage<T = unknown> {
  from?: 'kaption'
  url?: URL
  messageType: 'frameReady' | 'navigate' | string
  data: T
}

interface MsgAuth { from?: 'kaption' }
interface MsgBase { messageType: string, data: unknown }

interface MsgStandard { messageType: 'frameReady', data: string }

interface FrameUtilitySettings<T extends MsgBase> {
  sel?: string
  frameEl?: HTMLIFrameElement
  windowEl?: () => Window // window will change with iframe src
  onMessage?: MessageListener<T>
  onFrameLoad?: LoadListener
  relation: 'parent' | 'child'
  waitForReadySignal?: boolean
  src?: vue.Ref<string>
}

type MessageListener<T extends MsgBase> = (
  message: (T | MsgStandard) & MsgAuth,
) => void

type LoadListener = <T extends MsgBase>(util: FrameUtility<T>) => void

export class FrameUtility<
  T extends MsgBase = FrameMessage,
> extends FactorObject<FrameUtilitySettings<T>> {
  from: 'kaption' = 'kaption'
  relation = this.settings.relation
  sel = this.settings.sel
  frameEl = this.settings.frameEl || this.getFrameEl()
  frameWindow = () => this.frameEl?.contentWindow
  /**
   * window handling is to make this utility testable
   * necessary to assign 'window' to the frameEl window in tests
   */
  win = () => {
    const fw = this.frameWindow()
    const out = this.relation === 'child' ? (this.frameEl ? fw : window) : window
    if (!out)
      throw new Error('no window')
    return out
  }

  messageWindow = () => {
    const fw = this.frameWindow()
    const out = this.relation === 'child' ? this.win().parent : fw

    return out
  }

  messageBuffer: ((T | MsgStandard) & MsgAuth)[] = []
  loaded = vue.ref(false)
  waitForReadySignal = this.settings.waitForReadySignal ?? false

  hasReadySignal = vue.ref(!this.waitForReadySignal)
  isFrameReady = vue.computed(() => {
    return this.hasReadySignal.value
  })

  src = this.settings.src || vue.ref('')

  keyListening = false
  eventOrigins = ['localhost', 'kaption']
  onFrameLoad = this.settings.onFrameLoad ?? (() => {})
  messageCallbacks = new Set<MessageListener<T>>([
    this.settings.onMessage ?? (() => {}),
  ])

  constructor(settings: FrameUtilitySettings<T>) {
    super(`FrameUtility:${settings.relation}`, settings)

    if (this.relation === 'child') {
      this.sendReadySignal()
    }
    else {
      if (!this.frameEl) {
        this.log.error('missing frame element', { data: { sel: this.sel } })
        return
      }

      // initialize src attribute
      const frameSrc = this.frameEl.getAttribute('src') ?? ''
      if (frameSrc && !this.src.value)
        this.src.value = frameSrc

      /**
       * Watch for changes to src attribute and reload frame if changed
       */
      vue.watch(
        () => this.src.value,
        (v) => {
          if (!v || !this.frameEl)
            return

          this.frameEl.setAttribute('src', v)
          this.loaded.value = false
        },
        { immediate: true },
      )

      this.frameEl.addEventListener('load', async () => {
        if (!this.frameEl)
          return

        this.frameEl.dataset.loaded = this.src.value
        this.loaded.value = true

        await waitFor(400)

        this.onFrameLoad(this)
      })
    }

    vue.watch(
      () => this.isFrameReady.value,
      (v) => {
        if (v)
          this.flushBuffer()
      },
    )

    this.sendKeyboardEvents()

    this.listenForMessages()
  }

  getFrameEl(): HTMLIFrameElement | undefined {
    if (!this.sel || this.relation === 'child')
      return undefined

    const frameEl = document.querySelector(this.sel) as HTMLIFrameElement | null

    return frameEl ?? undefined
  }

  getUrl(): URL | undefined {
    if (this.src.value) {
      const fullSrc = this.src.value.includes('http')
        ? this.src.value
        : `${window.location.origin}${this.src.value}`

      return new URL(fullSrc)
    }
    else {
      return undefined
    }
  }

  onMessage(cb: MessageListener<T>) {
    this.messageCallbacks.add(cb)
  }

  listenForMessages(): void {
    this.win().addEventListener(
      'message',
      (event) => {
        const msg = event.data as FrameMessage

        // if (!this.eventOrigins.some((o) => event.origin.includes(o))) return

        if (!msg || typeof msg !== 'object' || msg.from !== 'kaption')
          return

        this.log.info('postMessage received', { data: msg })

        msg.url = this.getUrl()

        // if child send frameReady, it's ready for messages
        if (msg.messageType === 'frameReady' && !this.hasReadySignal.value)
          this.hasReadySignal.value = true

        this.messageCallbacks.forEach(cb => cb(msg))
      },
      false,
    )
  }

  sendReadySignal(): void {
    const mWindow = this.messageWindow()
    if (!mWindow)
      throw new Error('no message window')
    mWindow.postMessage(
      { from: 'kaption', messageType: 'frameReady', data: window.origin },
      '*',
    )
  }

  flushBuffer() {
    const mWindow = this.messageWindow()

    if (!mWindow)
      return
    if (!this.isFrameReady.value)
      return

    this.messageBuffer.forEach(async (message) => {
      this.log.info(`postMessage send`, { data: message })
      message.from = this.from

      const sendMessage = JSON.parse(JSON.stringify(message)) as T

      mWindow.postMessage(sendMessage, '*')
    })
    this.messageBuffer = []
  }

  sendMessage(args: { message: (T | MsgStandard) & MsgAuth }): void {
    const { message } = args
    this.messageBuffer.push(message)
    this.flushBuffer()
  }

  sendKeyboardEvents(): void {
    if (!this.keyListening) {
      this.keyListening = true

      const sendOnKeys = new Set(['Alt', 'Control', 'Meta'])
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        const { key } = event
        if (!sendOnKeys.has(key))
          return
        this.sendMessage({
          message: {
            messageType: 'keypress',
            data: { direction: 'down', key },
          } as T,
        })
      })
      document.addEventListener('keyup', (event: KeyboardEvent) => {
        const { key } = event
        if (!sendOnKeys.has(key))
          return
        this.sendMessage({
          message: {
            messageType: 'keypress',
            data: { direction: 'up', key },
          } as T,
        })
      })
    }
  }
}

/**
 * Makes the frame width draggable to allow for responsive visualization
 */
// export const makeDraggableFrame = (): void => {
//   const dragActive = vue.ref(false)
//   const frameOverlay = document.querySelector("#frameOverlay") as HTMLElement
//   const frameArea = document.querySelector("#frameArea") as HTMLElement
//   const handle = document.querySelector("#handle") as HTMLElement
//   const frameContainer = document.querySelector(
//     "#frameContainer",
//   ) as HTMLElement
//   const frameWidth = vue.ref<number>()

//   const resize = (e: MouseEvent): void => {
//     const mouseX = e.x
//     const frameAreaLeft = frameArea?.getBoundingClientRect().left ?? 0
//     const handleWidth = handle?.offsetWidth ?? 0
//     const frameAreaWidth = frameArea?.offsetWidth ?? 0

//     if (!dragActive.value) return

//     if (!frameAreaLeft || !handleWidth || !frameAreaWidth) {
//       frameWidth.value = undefined
//     } else if (mouseX > frameAreaLeft + frameAreaWidth - handleWidth) {
//       frameWidth.value = undefined
//     } else if (mouseX < frameAreaLeft + 400) {
//       frameWidth.value = 400
//     } else {
//       frameWidth.value = mouseX - frameAreaLeft + handleWidth / 2
//     }
//     if (frameContainer) {
//       frameContainer.style.width = frameWidth.value
//         ? `${frameWidth.value}px`
//         : ""
//     }
//   }

//   if (handle) {
//     handle.addEventListener("mousedown", () => {
//       if (frameOverlay) {
//         frameOverlay.style.display = "block"
//       }
//       dragActive.value = true
//       document.addEventListener("mousemove", resize, false)
//       document.addEventListener(
//         "mouseup",
//         () => {
//           dragActive.value = false

//           document.removeEventListener("mousemove", resize, false)
//         },
//         false,
//       )
//     })
//   }
//   document.addEventListener(
//     "mouseup",
//     () => {
//       if (frameOverlay) {
//         frameOverlay.style.display = "none"
//       }
//     },
//     false,
//   )
// }
