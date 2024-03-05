<script lang="ts" setup generic="T extends MsgUnknown">
import { shortId, vue } from '@fiction/core'
import type { MsgUnknown } from './elBrowserFrameUtil'
import { FrameNavigator, FrameUtility } from './elBrowserFrameUtil'
import ElButton from './ElButton.vue'
import ElLoading from './ElLoading.vue'

const props = defineProps({
  deviceMode: {
    type: String as vue.PropType<'desktop' | 'tablet' | 'mobile' | 'landscape'>,
    default: 'desktop',
  },
  frameId: { type: String, required: true },
  url: { type: String, default: undefined },
  displayUrl: { type: String, default: '' },
  browserBar: { type: Boolean, default: false },
})
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
  const deviceMode = props.deviceMode

  const devices = {
    mobile: { minWidth: 375, minHeight: 667, aspectClass: 'aspect-[9/16]' },
    landscape: { minWidth: 500, minHeight: 500, aspectClass: 'aspect-[4/3]' },
    tablet: { minWidth: 768, minHeight: 400, aspectClass: 'aspect-[3/4]' },
    desktop: { minWidth: 1300, minHeight: 700, aspectClass: 'aspect-[3/4]' },
  }
  return devices[deviceMode]
})

type Scale = { scale: number, width: string, height: string }

function setLoaded() {
  setTimeout(() => loading.value = false, 1400)
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
        frameSize.value
        = widthScale.scale < heightScale.scale ? widthScale : heightScale
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
    const url = new URL(props.url || '', 'http://dummybase.com')

    // Add a 'key' query parameter with the value from shortId()
    url.searchParams.set('key', shortId())

    // Return the modified URL as a string
    return url.toString().replace('http://dummybase.com', '')
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

const navigator = new FrameNavigator({
  updateCallback: async (path) => {
    emit('update:url', path)
  },
  urlOrPath: vue.computed(() => props.url || '/'),
  displayUrl: vue.computed(() => props.displayUrl),
})
</script>

<template>
  <div class="bg-theme-0 dark:bg-theme-800 @container border dark:border-theme-600 overflow-hidden">
    <div v-if="browserBar" class="flex items-center justify-between px-2 py-2 border-b border-theme-200 dark:border-theme-700">
      <div class="w-full items-center justify-center lg:flex lg:space-x-2">
        <div class="space-x-1 hidden">
          <div
            class="hover:bg-theme-200 size-6 text-base cursor-pointer items-center justify-center rounded-md flex"
            :class="
              navigator.navPointer.value === navigator.activeHistory.value.paths.length
                ? 'cursor-not-allowed opacity-50'
                : ''
            "
            @click="navigator.navigateFrame('backward')"
          >
            <div class="i-tabler-arrow-left" />
          </div>
          <div
            class="hover:bg-theme-200  size-6 text-base cursor-pointer items-center justify-center rounded-md flex"
            :class="
              navigator.activeHistory.value.pointer === 0 ? 'cursor-not-allowed opacity-50' : ''
            "
            @click="navigator.navigateFrame('forward')"
          >
            <div class="i-tabler-arrow-right" />
          </div>
        </div>
        <label for="urlBar" class="relative flex grow rounded-md shadow-sm  group border border-theme-200 dark:border-theme-600 focus-within:border-theme-200 overflow-hidden">
          <span
            class="bg-theme-0 dark:bg-theme-900 hidden text-theme-300 @5xl:inline-flex select-none items-center rounded-l-md pl-2.5 pr-2 font-medium text-xs"
            :title="navigator.displayUrlObject.value.origin"
          >
            {{ navigator.displayUrlObject.value.origin }}
          </span>
          <input
            id="urlBar"
            v-model="navigator.typedPath.value"
            type="text"
            class="block focus:border-0 text-theme-500 dark:text-theme-0 dark:bg-theme-950 border-0 w-full min-w-0 flex-1 rounded-none rounded-r-md text-xs focus:outline-none focus:ring-0 p-1.5"
            @keyup.enter="navigator.setNewPath({ fullPath: navigator.typedPath.value })"
          >
        </label>
      </div>
      <div class="ml-4 hidden shrink-0 md:block">
        <ElButton
          btn="default"
          class="uppercase"
          size="md"
          @click="navigator.setNewPath({ fullPath: navigator.typedPath.value })"
        >
          Go &rarr;
        </ElButton>
      </div>
      <slot name="browserBar" />
    </div>
    <div
      :id="`${frameId}-wrap`"
      class="relative max-h-[100%] overflow-hidden "
      :class="dimensions.aspectClass"
    >
      <iframe
        :id="frameId"
        ref="frame"
        class="absolute inset-0 h-full w-full origin-top-left bg-theme-50"
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
          <div class="w-[25%]">
            <ElLoading />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
