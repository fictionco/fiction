<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { onResetUi, resetUi, useService, vue } from '@factor/api'
import { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import type { ChatAgent, PostMessageAgent } from './obj'
import type { PageLinesAgent } from '.'

const props = defineProps({
  deviceMode: {
    type: String as vue.PropType<'desktop' | 'mobile' | 'tablet'>,
    default: 'desktop',
  },
  agent: {
    type: Object as vue.PropType<ChatAgent>,
    required: true,
  },
})

useService<{
  pageLinesAgent: PageLinesAgent
  factorRouter: FactorRouter
}>()

const ignoreChange = vue.ref(false)
const frame = vue.ref<HTMLIFrameElement | undefined>()
const frameSizeDefault = { scale: 1, width: '100%', height: '100%' }
const frameSize = vue.ref(frameSizeDefault)

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
      minWidth: 600,
      minHeight: 500,
      aspectClass: 'aspect-[3/4]',
    }
  }
  else {
    return {
      minWidth: 800,
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
  const wrapEl = document.querySelector('#visualizer-wrap')
  if (wrapEl)
    ro.observe(wrapEl)

  const frameEl = frame.value

  if (frameEl) {
    // // listen to events in parent that need ux in frame
    const frameUtility = new FrameUtility<PostMessageAgent>({
      sel: '#visualizer',
      onFrameLoad: () => {},
      relation: 'parent',
      waitForReadySignal: true,
      src: vue.ref(`/visualizer-agent/${props.agent.agentId.value}`), // form data sent from parent (no formId)
      onMessage: (e) => {
        if (e.messageType === 'setAgent') {
          ignoreChange.value = true

          props.agent?.update(e.data)
        }
        else if (e.messageType === 'resetUi') {
          resetUi({ scope: 'iframe', cause: 'visualizerMessage' })
        }
      },
    })

    frameUtility.init()

    onResetUi((args) => {
      if (args.scope === 'iframe')
        return
      frameUtility.sendMessage({
        message: { messageType: 'resetUi', data: {} },
      })
    })

    vue.watch(
      () => props.agent,
      (v) => {
        if (v && !ignoreChange.value) {
          const data = v.toConfig()

          frameUtility.sendMessage({
            message: { messageType: 'setAgent', data },
          })
        }
        else {
          ignoreChange.value = false
        }
      },
      { immediate: true, deep: true },
    )
  }
})
</script>

<template>
  <div
    id="visualizer-wrap"
    class="relative max-h-[100%] overflow-hidden bg-white"
    :class="dimensions.aspectClass"
  >
    <iframe
      id="visualizer"
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
