<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '@factor/api'
import { FrameUtility } from '@kaption/core/ui/elBrowserFrameUtil'
import type { PostMessageForm } from '../form'
import type { DeviceMode } from './util'

const props = defineProps({
  deviceMode: { type: String as vue.PropType<DeviceMode>, default: 'desktop' },
  frameId: { type: String, required: true },
  url: { type: String, required: true },
})
const frame = vue.ref<HTMLIFrameElement | undefined>()
const frameSizeDefault = { scale: 1, width: '100%', height: '100%' }
const frameSize = vue.ref(frameSizeDefault)

type PostMessageDeviceFrame =
  | {
    messageType: 'deviceFrame'
    data: Record<string, any>
  }
  | { messageType: 'resetUi', data: {} }

const frameUtility = vue.ref<FrameUtility<PostMessageDeviceFrame>>()
defineExpose({ frameUtility })

const dimensions = vue.computed(() => {
  const deviceMode = props.deviceMode

  if (deviceMode === 'mobile') {
    return {
      minWidth: 375,
      minHeight: 667,
      aspectClass: 'aspect-[9/16]',
    }
  }
  else if (deviceMode === 'tablet') {
    return {
      minWidth: 768,
      minHeight: 500,
      aspectClass: 'aspect-[3/4]',
    }
  }
  else if (deviceMode === 'landscape') {
    return {
      minWidth: 500,
      minHeight: 768,
      aspectClass: 'aspect-[4/3]',
    }
  }
  else {
    return {
      minWidth: 1024,
      minHeight: 500,
      aspectClass: 'aspect-[16/9]',
    }
  }
})

interface Scale {
  scale: number
  width: string
  height: string
}
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

vue.onMounted(async () => {
  const wrapEl = document.querySelector(`#${props.frameId}-wrap`)
  if (wrapEl)
    ro.observe(wrapEl)

  // // listen to events in parent that need ux in frame
  const frameUtility = new FrameUtility<PostMessageForm>({
    sel: `#${props.frameId}`,
    relation: 'parent',
    waitForReadySignal: true,
    src: vue.computed(() => props.url), // form data sent from parent (no formId)
    onMessage: (e) => {
      if (e.messageType === 'resetUi')
        resetUi({ scope: 'iframe', cause: 'visualizerMessage' })
    },
  })

  onResetUi((args) => {
    if (args.scope === 'iframe')
      return
    frameUtility.sendMessage({
      message: { messageType: 'resetUi', data: {} },
    })
  })
})
</script>

<template>
  <div
    :id="`${frameId}-wrap`"
    class="relative max-h-[100%] overflow-hidden bg-white"
    :class="dimensions.aspectClass"
  >
    <iframe
      :id="frameId"
      ref="frame"
      class="absolute inset-0 h-full w-full origin-top-left"
      :class="dimensions.aspectClass"
      frameborder="0"
      :style="{
        transform: `scale(${frameSize.scale})`,
        height: frameSize.height,
        width: frameSize.width,
      }"
    />
  </div>
</template>
