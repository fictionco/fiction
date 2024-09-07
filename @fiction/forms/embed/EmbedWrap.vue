<script lang="ts" setup>
import { getColorScheme } from '@fiction/core/utils/colors'
import { onEvent } from '@fiction/core/utils/event'
import chroma from 'chroma-js'
import { computed, onMounted, ref, watch } from 'vue'
import type { ColorThemeWithInvert } from '@fiction/core/utils/colors'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import type { StyleValue } from 'vue'
import EmbedModal from './EmbedModal.vue'
import EmbedPopover from './EmbedPopover.vue'
import EmbedSlideOver from './EmbedSlideOver.vue'
import { createKeyboardListener, displaySymbols } from './keyboard'
import { embedPosition } from './util'

const props = defineProps({
  agentConfig: { type: Object, required: true },
  elementId: { type: String, default: undefined },
  url: { type: String, required: true },
})

const embedFrame = ref<HTMLIFrameElement | undefined>()
const active = ref(false)

const loaded = ref(false)
const frameLoaded = ref(false)

const theme = computed(() => {
  let scheme: ColorThemeWithInvert = 'slate'
  if (props.agentConfig.options?.theme === 'dark')
    scheme = 'slateInverted'

  return getColorScheme(scheme)
})

const config = computed(() => {
  const c = props.agentConfig
  const opts = c.options || {}

  const position = opts.position || 'br'
  const p = embedPosition.find(p => p.value === position) || embedPosition[0]

  const buttonBg = opts.colorButton || '#2563eb'
  const contrast = chroma(buttonBg).luminance() < 0.5 ? chroma(buttonBg).brighten(3) : chroma(buttonBg).darken(3)

  const slightContrast = chroma(buttonBg).luminance() < 0.5 ? chroma(buttonBg).brighten(0.5) : chroma(buttonBg).darken(0.5)

  return {
    position,
    mode: opts.mode || 'modal',
    trigger: opts.trigger || 'button',
    text: opts.text || '',
    contrast: contrast.toString(),
    slightContrast: slightContrast.toString(),
    fixedStyle: { ...p.style },
    style: {
      'border': `1px solid ${slightContrast.toString()}`,
      'background-color': buttonBg,
      'color': contrast.toString(),
      'z-index': 1000,
    } as StyleValue,
  }
})

const displayKeyboard = computed(() => {
  const k = props.agentConfig.options?.keyboardShortcut
  return displaySymbols(k)
})

onMounted(() => {
  if (config.value.trigger === 'init')
    active.value = true

  watch(
    () => props.agentConfig.options?.keyboardShortcut,
    (v) => {
      createKeyboardListener({ selectedKey: v, cb: () => toggleActive() })
    },
    { immediate: true },
  )

  watch(
    () => active.value,
    async (v) => {
      if (v)
        await setFramePusher()
    },
    { immediate: true },
  )

  setTimeout(() => {
    loaded.value = true
  }, 300)
})

const frameUtil = ref<FrameUtility>()
async function setFramePusher() {
  const { FrameUtility } = await import('@fiction/ui/frame/elBrowserFrameUtil.js')
  setTimeout(() => {
    console.warn('set frame parent')

    const frameEl = embedFrame.value

    if (!frameEl)
      throw new Error('no frame element')

    frameUtil.value = new FrameUtility({
      frameEl,
      relation: 'parent',
      waitForReadySignal: true,
      onMessage: (a) => {
        if (a.messageType === 'close') {
          console.warn('close', props.elementId)
          close()
        }
      },
    })

    frameUtil.value.init()

    frameUtil.value.sendMessage({
      message: { messageType: 'setAgent', data: props.agentConfig },
    })
  }, 200)
}

async function toggleActive() {
  active.value = !active.value
}

function close() {
  active.value = false
}

onEvent('triggerEmbed', (args: { elementId: string }) => {
  if (args.elementId === props.elementId)
    active.value = true
})
</script>

<template>
  <div
    class="embed-wrap"
    :data-frame-url="url"
    :data-trigger="config.trigger"
  >
    <div
      class="Z-40 fixed flex flex-col space-y-4 md:space-y-8"
      :class="
        config.position === 'bl'
          ? 'items-start'
          : config.position === 'bc'
            ? 'items-center'
            : 'items-end'
      "
      :style="config.fixedStyle"
    >
      <EmbedPopover v-if="config.mode === 'popover'" v-model:vis="active">
        <iframe
          ref="embedFrame"
          :src="url.toString()"
          class="h-full w-full"
          :class="frameLoaded ? 'opacity-100' : 'opacity-0'"
          @load="frameLoaded = true"
        />
      </EmbedPopover>
      <div
        v-if="config.trigger === 'button'"
        class="button-shadow relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 active:scale-95"
        :class="loaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
        :style="config.style"
        title="Activate"
        @click="toggleActive()"
      >
        <div class="overlay pointer-events-none absolute inset-0" />
        <div class="inset-0 flex aspect-square flex-col justify-center">
          <div class="p-2.5">
            <transition :name="active ? 'next' : 'prev'" mode="out-in">
              <template v-if="!active">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-7 w-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </template>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-7 w-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </transition>
          </div>
          <div
            v-show="
              !active
                && agentConfig.options?.keyboardShortcut
                && agentConfig.options?.keyboardShortcut !== 'none'
            "
            class="hidden origin-top items-center justify-center whitespace-nowrap p-[2px] font-sans text-xs font-semibold capitalize transition-all md:flex"
            :class="active ? 'h-0' : 'h-auto'"
            :style="{ backgroundColor: config.slightContrast }"
          >
            <span> {{ displayKeyboard?.symbol }} </span><span class="mb-0.5 inline-block px-0.5 opacity-30">&plus;</span><span>{{ displayKeyboard?.letter }}</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <EmbedSlideOver v-if="config.mode === 'slideover'" v-model:vis="active">
        <iframe
          ref="embedFrame"
          :src="url.toString()"
          class="h-full w-full"
          :class="frameLoaded ? 'opacity-100' : 'opacity-0'"
          @load="frameLoaded = true"
        />
      </EmbedSlideOver>
      <EmbedModal v-else-if="config.mode === 'modal'" v-model:vis="active">
        <iframe
          ref="embedFrame"
          :src="url.toString()"
          class="h-full w-full"
          :class="frameLoaded ? 'opacity-100' : 'opacity-0'"
          @load="frameLoaded = true"
        />
      </EmbedModal>
      <div
        v-else-if="config.mode === 'inline'"
        class="overflow-hidden rounded-lg"
      >
        <iframe
          ref="embedFrame"
          :src="url.toString()"
          class="aspect-[4/3] w-full"
          :class="frameLoaded ? 'opacity-100' : 'opacity-0'"
          @load="frameLoaded = true"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.embed-wrap {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-1000: v-bind("theme[1000]");

  .button-shadow {
    box-shadow: var(--shadow-elevation-medium);

    &:active {
      box-shadow: var(--shadow-elevation-low);
    }

    .overlay {
      background: linear-gradient( to bottom,  rgba(255, 255, 255, 0) 0%,  rgba(255, 255, 255, 0) 0%,  rgba(0, 0, 0, 0.2) 100%  );
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      pointer-events: none;
      mix-blend-mode: overlay;
    }
  }
}

// .next-enter-from,
// .prev-leave-to {
//   opacity: 0;
//   transform: translateY(15px);
// }
// .next-enter-to,
// .next-leave-from,
// .prev-enter-to,
// .prev-leave-from {
//   transform: translateY(0);
// }
// .next-enter-active,
// .next-leave-active,
// .prev-enter-active,
// .prev-leave-active {
//   transition: 0.2s ease;
//   transition-property: opacity, transform;
// }

// .next-leave-to,
// .prev-enter-from {
//   opacity: 0;
//   transform: translateY(-15px);
// }
</style>
