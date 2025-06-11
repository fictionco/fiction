<script lang="ts" setup generic="T extends MsgUnknown">
import type { MediaObject } from '@fiction/core/index.js'
import type { MsgUnknown } from './elBrowserFrameUtil.js'
import { shortId, vue } from '@fiction/core/index.js'
import ElSpinner from '../loaders/ElSpinner.vue'
import BarBrowser from './BarBrowser.vue'
import BarEmail from './BarEmail.vue'
import { FrameUtility } from './elBrowserFrameUtil.js'

type EmailSettings = {
  senderName?: string
  senderEmail?: string
  subject?: string
  preview?: string
  avatar?: MediaObject
  dateAt?: string
}

const { deviceMode = 'desktop', frameId, url, displayUrl, formatMode = 'browser', emailBar, showBrowserBar = false } = defineProps<{
  deviceMode?: 'desktop' | 'tablet' | 'mobile' | 'landscape'
  frameId: string
  url?: string
  displayUrl?: string
  formatMode?: 'email' | 'browser'
  emailBar?: EmailSettings
  showBrowserBar?: boolean
}>()

const emit = defineEmits<{
  (event: 'frameUtility', payload: FrameUtility): void
  (event: 'message', payload: MsgUnknown): void
  (event: 'update:url', payload: string): void
}>()

const loading = vue.ref(true)
const frame = vue.ref<HTMLIFrameElement | undefined>()
const frameSizeDefault = { scale: 1, width: '100%', height: '100%' }
const frameSize = vue.ref(frameSizeDefault)

const frameUtility = vue.shallowRef<FrameUtility>()
defineExpose({ frameUtility })

const dimensions = vue.computed(() => {
  const devices = {
    mobile: { minWidth: 375, minHeight: 100, aspectClass: 'aspect-[9/16]' },
    landscape: { minWidth: 500, minHeight: 100, aspectClass: 'aspect-[4/3]' },
    tablet: { minWidth: 768, minHeight: 100, aspectClass: 'aspect-[3/4]' },
    desktop: { minWidth: formatMode === 'email' ? 900 : 1300, minHeight: 100, aspectClass: 'aspect-[3/4]' },
  }
  return devices[deviceMode]
})

type Scale = { scale: number, width: string, height: string }

function setLoaded() {
  setTimeout(() => loading.value = false, 300)
}

vue.onMounted(async () => {
  /**
   * If frame goes below a certain size then scale the contents.
   * - min width is 1024, at this point we hold iframe at this width
   * - scale down the visual size, setting height/width manually
   */
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { minHeight, minWidth } = dimensions.value
      const cr = entry.contentRect

      const aspect = cr.width / cr.height

      let widthScale: Scale | undefined
      let heightScale: Scale | undefined
      if (cr.width < minWidth) {
        const scale = cr.width / minWidth
        widthScale = {
          scale,
          width: `${minWidth}px`,
          height: `${minWidth / aspect}px`,
        }
      }

      if (cr.height < minHeight) {
        const scale = cr.height / minHeight
        heightScale = {
          scale,
          width: 'auto', // `${minHeight * aspect}px`,
          height: `${minHeight}px`,
        }
      }

      if (widthScale && heightScale) {
        frameSize.value = widthScale.scale < heightScale.scale ? widthScale : heightScale
      }
      else {
        frameSize.value = widthScale || heightScale || frameSizeDefault
      }
    }
  })

  const frameEl = frame.value
  if (!frameEl)
    throw new Error('no frame element')

  const frameWrap = frameEl.parentElement

  if (frameWrap)
    ro.observe(frameWrap)

  const src = vue.computed(() => {
    // Create a URL object from the props.url
    const srcUrl = new URL(url || '', 'http://dummybase.com')

    // Add a 'key' query parameter with the value from shortId()
    srcUrl.searchParams.set('key', shortId())

    // Return the modified URL as a string
    return srcUrl.toString().replace('http://dummybase.com', '')
  })

  vue.watch(src, () => {
    loading.value = true
  })

  // // listen to events in parent that need ux in frame
  frameUtility.value = new FrameUtility({
    frameEl,
    relation: 'parent',
    waitForReadySignal: true,
    src,
    onMessage: (e) => {
      if (e.messageType === 'frameReady')
        setLoaded()

      emit('message', e)
    },
  })

  frameUtility.value.init()

  emit('frameUtility', frameUtility.value)
})
</script>

<template>
  <div class="@container/frame bg-theme-0 dark:bg-theme-800 @container border border-theme-200 dark:border-theme-500/50 overflow-hidden flex flex-col">
    <template v-if="$slots.bar">
      <slot name="bar" />
    </template>
    <template v-else>
      <BarEmail v-if="formatMode === 'email'" :email-bar="emailBar" />
      <BarBrowser v-else-if="showBrowserBar" :url :display-url="displayUrl" @update:url="emit('update:url', $event)" />
    </template>

    <div
      :id="`${frameId}-wrap`"
      class="relative max-h-[100%] overflow-scroll no-scrollbar w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
      :class="dimensions.aspectClass"
    >
      <iframe
        :id="frameId"
        ref="frame"
        class="absolute inset-0 h-full w-full origin-top-left bg-theme-50 dark:bg-theme-900 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
        :class="dimensions.aspectClass"
        frameborder="0"
        :style="{
          transform: `scale(${frameSize.scale})`,
          height: frameSize.height,
          width: frameSize.width,
        }"
        @load="setLoaded()"
      />
      <transition name="fade">
        <div v-if="loading" class="absolute inset-0 text-center pt-24 flex justify-center h-full bg-white/95 dark:bg-theme-950/90">
          <ElSpinner class="size-10" />
        </div>
      </transition>
    </div>
  </div>
</template>
