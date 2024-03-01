<script lang="ts" setup>
import { vue } from '@factor/api'
import { useKaption } from '../utils'
import { createProxyUrl } from '../plugin-proxy/utils'
import { FrameUtility } from './elBrowserFrameUtil'

const props = defineProps({
  url: { type: String, default: '' },
})
const emit = defineEmits(['load', 'message', 'url'])
const { kaptionProxyServer } = useKaption()
const frame = vue.ref<HTMLIFrameElement | undefined>()

const proxyUrl = vue.computed(() =>
  createProxyUrl({
    clientUrl: props.url,
    proxyUrl: kaptionProxyServer.url.value,
  }),
)

// listen to events in parent that need ux in frame
const frameUtility = new FrameUtility({
  sel: '#editFrame',
  src: vue.computed(() => props.url),
  onMessage: (msg) => {
    emit('message', msg)
  },
  onFrameLoad: (util) => {
    emit('load', util)
  },
  relation: 'parent',
})

async function setFrameSrcAttr(): Promise<void> {
  frameUtility.src.value = proxyUrl.value
}
/**
 * Recursively wait for iframe url
 */
async function waitForUrlLoader(): Promise<void> {
  if (props.url)
    await setFrameSrcAttr()
  else
    setTimeout(() => waitForUrlLoader(), 100)
}

vue.onMounted(async () => {
  const frameEl = frame.value

  if (frameEl) {
    const tokenList = [
      'allow-pointer-lock',
      'allow-popups',
      'allow-presentation',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ]

    tokenList.forEach((token) => {
      frameEl.sandbox.add(token)
    })

    await waitForUrlLoader()
  }
})

vue.watch(
  () => props.url,
  async (v) => {
    if (v)
      await setFrameSrcAttr()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <iframe id="editFrame" ref="frame" />
</template>
