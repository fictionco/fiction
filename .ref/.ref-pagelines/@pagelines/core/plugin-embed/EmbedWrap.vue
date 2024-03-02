<script lang="ts" setup>
import type { PropType, StyleValue } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { onEvent } from '@factor/api/utils/event'
import type { ColorScheme } from '@factor/api/utils/colors'
import { getColorScheme } from '@factor/api/utils/colors'
import type { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import chroma from 'chroma-js'
import type { IconKeys } from '../ui/StandardIcon.vue'
import StandardIcon from '../ui/StandardIcon.vue'
import type { TableAgentConfig } from '../tables'
import EmbedSlideOver from './EmbedSlideOver.vue'
import EmbedModal from './EmbedModal.vue'
import EmbedPopover from './EmbedPopover.vue'
import { buttonIcons, embedPosition } from './util'
import { createKeyboardListener, displaySymbols } from './keyboard'

const props = defineProps({
  agentConfig: {
    type: Object as PropType<Partial<TableAgentConfig>>,
    required: true,
  },
  elementId: { type: String, default: undefined },
  url: { type: String, required: true },
})

const agentFrame = ref<HTMLIFrameElement | undefined>()
const active = ref(false)

const loaded = ref(false)
const frameLoaded = ref(false)

const theme = computed(() => {
  let scheme: ColorScheme = 'slate'
  if (props.agentConfig.options?.theme === 'dark')
    scheme = 'slateInverted'

  return getColorScheme(scheme).colors
})

const config = computed(() => {
  const c = props.agentConfig
  const opts = c.options || {}

  const position = opts.position || 'br'
  const p = embedPosition.find(p => p.value === position) || embedPosition[0]

  const buttonBg = opts.colorButton || '#2563eb'
  const contrast
    = chroma(buttonBg).luminance() < 0.5
      ? chroma(buttonBg).brighten(3)
      : chroma(buttonBg).darken(3)

  const slightContrast
    = chroma(buttonBg).luminance() < 0.5
      ? chroma(buttonBg).brighten(0.5)
      : chroma(buttonBg).darken(0.5)

  return {
    position,
    mode: opts.mode || 'modal',
    trigger: opts.trigger || 'button',
    text: opts.text || '',
    icon: (opts.iconButton || buttonIcons[0].value) as IconKeys,
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
      createKeyboardListener({
        selectedKey: v,
        cb: () => toggleActive(),
      })
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
  const { FrameUtility } = await import('@factor/ui/elBrowserFrameUtil')
  setTimeout(() => {
    console.warn('set frame parent')
    frameUtil.value = new FrameUtility({
      frameEl: agentFrame.value,
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
    :data-pl-url="url"
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
          ref="agentFrame"
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
        title="Activate AI Assistant"
        @click="toggleActive()"
      >
        <div class="overlay pointer-events-none absolute inset-0" />
        <div class="inset-0 flex aspect-square flex-col justify-center">
          <div class="p-2.5">
            <transition :name="active ? 'next' : 'prev'" mode="out-in">
              <template v-if="!active">
                <StandardIcon
                  class="h-7 w-7"
                  :icon-key="config.icon"
                />
              </template>
              <svg
                v-else
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
          ref="agentFrame"
          :src="url.toString()"
          class="h-full w-full"
          :class="frameLoaded ? 'opacity-100' : 'opacity-0'"
          @load="frameLoaded = true"
        />
      </EmbedSlideOver>
      <EmbedModal v-else-if="config.mode === 'modal'" v-model:vis="active">
        <iframe
          ref="agentFrame"
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
          ref="agentFrame"
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

  --shadow-color: 0deg 0% 0%;
  --shadow-elevation-low: 0.1px 0.3px 0.4px hsl(var(--shadow-color) / 0.05),
    0.2px 0.4px 0.6px -0.9px hsl(var(--shadow-color) / 0.06),
    0.4px 0.9px 1.2px -1.8px hsl(var(--shadow-color) / 0.08);
  --shadow-elevation-medium: 0.1px 0.3px 0.4px hsl(var(--shadow-color) / 0.04),
    0.3px 0.7px 0.9px -0.4px hsl(var(--shadow-color) / 0.05),
    0.6px 1.3px 1.8px -0.9px hsl(var(--shadow-color) / 0.06),
    1.1px 2.5px 3.4px -1.3px hsl(var(--shadow-color) / 0.06),
    2px 4.6px 6.2px -1.8px hsl(var(--shadow-color) / 0.07);
  --shadow-elevation-high: 0.1px 0.3px 0.4px hsl(var(--shadow-color) / 0.04),
    0.5px 1.2px 1.6px -0.2px hsl(var(--shadow-color) / 0.04),
    0.9px 2px 2.7px -0.4px hsl(var(--shadow-color) / 0.05),
    1.3px 2.9px 3.9px -0.6px hsl(var(--shadow-color) / 0.05),
    1.8px 4.1px 5.5px -0.8px hsl(var(--shadow-color) / 0.05),
    2.5px 5.6px 7.5px -1px hsl(var(--shadow-color) / 0.06),
    3.4px 7.7px 10.4px -1.2px hsl(var(--shadow-color) / 0.06),
    4.6px 10.5px 14.1px -1.4px hsl(var(--shadow-color) / 0.06),
    6.2px 14.1px 18.9px -1.6px hsl(var(--shadow-color) / 0.06),
    8.2px 18.8px 25.2px -1.8px hsl(var(--shadow-color) / 0.07);

  .button-shadow {
    box-shadow: var(--shadow-elevation-medium);

    &:active {
      box-shadow: var(--shadow-elevation-low);
    }

    .overlay {
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.2) 100%
      );
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      pointer-events: none;
      mix-blend-mode: overlay;
    }
  }
}

.next-enter-from,
.prev-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.next-enter-to,
.next-leave-from,
.prev-enter-to,
.prev-leave-from {
  transform: translateY(0);
}
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: 0.2s ease;
  transition-property: opacity, transform;
}

.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
