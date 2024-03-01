<script lang="ts" setup>
import { resetUi, vue } from '@factor/api'
import InputUrl from '@factor/ui/InputUrl.vue'
import HighlightCode from '@factor/plugin-highlight-code/HighlightCode.vue'
import { InputOption } from '../../utils/inputOption'
import { useKaption } from '../../utils/inject'
import ElButton from '../../ui/ElButton.vue'
import { buttonIcons, embedPosition } from '../../plugin-embed/util'
import ElOption from '../../ui/ElOption.vue'
import ElDeviceFrame from './ElDeviceFrame.vue'

const { kaptionForms, factorRouter, factorApp } = useKaption()
const frameEl = vue.ref<InstanceType<typeof ElDeviceFrame> | null>(null)
function selectText(event: MouseEvent) {
  const target = event.target as HTMLInputElement
  target.select()
}

const copyText = vue.ref<Record<string, string>>({
  url: 'Copy URL',
  embed: 'Copy Embed HTML',
})

const embedParams = vue.ref<Record<string, string>>({})

function updateEmbedParam(key: string, value: string) {
  embedParams.value[key] = value
}

const activeEmbed = vue.computed(() => {
  const m = embedParams.value.mode
  const v = embedModes.find(e => e.value === m)

  return v
})

const frameSrc = vue.computed(() => {
  const formId = factorRouter.params.value.formId as string
  const u = new URL(factorApp.appUrl.value)
  u.pathname = `/visualizer-embed/${formId}`
  u.search = new URLSearchParams(embedParams.value).toString()
  return u.toString()
})

const embedUrl = vue.computed(() => {
  const formId = factorRouter.params.value.formId as string
  const u = new URL(kaptionForms.getFormUrl(formId))

  u.search = new URLSearchParams(embedParams.value).toString()
  return u.toString()
})

vue.watch(
  () => embedUrl.value,
  (v) => {
    setTimeout(() => {
      resetUi({ cause: 'embedUrl', scope: 'all' })
    }, 100)
  },
)

const embedHtml = vue.computed(() => {
  const trigger = embedParams.value.trigger
  const mode = embedParams.value.mode
  const formName = kaptionForms.activeForm.value?.formName.value
  if (trigger === 'click' && mode !== 'inline')
    return `<button data-kaption-form="${formName}" type="button" class="add-your-classes" data-kaption-embed="${embedUrl.value}">Show Form</button>`
  else
    return `<div data-kaption-form="${formName}" data-kaption-embed="${embedUrl.value}"></div>`
})

async function handleCopyText(sel: string, key: string): Promise<void> {
  await vue.nextTick()

  const elCopy: HTMLInputElement | null = document.querySelector(sel)

  if (!elCopy)
    return

  elCopy.setAttribute('type', 'text')
  elCopy.select()

  document.execCommand('copy')

  elCopy.setAttribute('type', 'hidden')

  const orig = copyText.value[key] as string

  copyText.value = { ...copyText.value, [key]: 'Copied!' }

  setTimeout(() => {
    copyText.value = { ...copyText.value, [key]: orig }
  }, 2000)
}

const embedModes = [
  {
    name: 'Inline',
    desc: 'Show within your content.',
    value: 'inline',
  },
  {
    name: 'Full Page',
    desc: 'Show full screen based on event or on load.',
    value: 'full',
  },
  {
    name: 'Modal',
    desc: 'Launch a modal popup based on an event',
    value: 'modal',
  },
  {
    name: 'Slideover',
    desc: 'Launch a slideover popup based on an event',
    value: 'slideover',
  },
  {
    name: 'Popover',
    desc: 'Show a popover based on an event',
    value: 'popover',
  },
]

const opts = vue.computed(() => {
  const inlineMode = embedParams.value.mode === 'inline'
  const out = [
    new InputOption({
      label: 'Embed Mode',
      description: 'How the form will be embedded',
      optionKey: 'mode',
      input: 'InputSelectCustom',
      props: vue.computed(() => {
        return {
          list: embedModes,
        }
      }),
    }),

    new InputOption({
      label: 'Trigger / Button',
      description: 'The element that will trigger the embed',
      optionKey: 'trigger',
      input: 'InputSelectCustom',
      isVisible: vue.computed(() => {
        return !inlineMode
      }),
      props: vue.computed(() => {
        return {
          list: [
            {
              name: 'Load',
              value: 'init',
              desc: 'Show on page load',
            },
            {
              name: 'Click',
              value: 'click',
              desc: 'Trigger on click of the element',
            },
            {
              name: 'Bubble',
              desc: 'Generates a clickable bubble element',
              value: 'bubble',
            },
            {
              name: 'Button',
              desc: 'Generates a clickable button element',
              value: 'button',
            },
            {
              name: 'Event',
              desc: 'Trigger on a Kaption event',
              value: 'event',
            },
          ],
        }
      }),
    }),

    new InputOption({
      label: 'Button Text',
      optionKey: 'text',
      input: 'InputText',
      isVisible: vue.computed(() => {
        return embedParams.value.trigger === 'button' && !inlineMode
      }),
    }),

    new InputOption({
      label: 'Button Icon',
      optionKey: 'icon',
      input: 'InputSelect',
      props: vue.computed(() => {
        return {
          list: buttonIcons,
        }
      }),
      isVisible: vue.computed(() => {
        return (
          ['button', 'bubble'].includes(embedParams.value.trigger)
          && !inlineMode
        )
      }),
    }),

    new InputOption({
      label: 'Color Scheme',
      optionKey: 'scheme',
      input: 'InputColorScheme',
      isVisible: vue.computed(() => {
        return (
          ['button', 'bubble'].includes(embedParams.value.trigger)
          && !inlineMode
        )
      }),
    }),

    new InputOption({
      label: 'Button Position',
      optionKey: 'position',
      input: 'InputSelect',
      props: vue.computed(() => {
        return {
          list: embedPosition,
        }
      }),
      isVisible: vue.computed(() => {
        return (
          ['button', 'bubble'].includes(embedParams.value.trigger)
          && !inlineMode
        )
      }),
    }),
  ]

  return out
})

async function setEmbedMode(mode?: string) {
  await factorRouter.setQueryVar('mode', mode)
}

vue.onMounted(async () => {
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  if (frameEl.value) {
    const frameUtil = frameEl.value.frameUtility
  }
})
</script>

<template>
  <div class="py-12">
    <div v-if="activeEmbed?.value" class="mx-auto w-full max-w-screen-lg pb-32">
      <ElButton
        btn="default"
        size="sm"
        @click="setEmbedMode()"
      >
        &larr; Back To Sharing Overview
      </ElButton>
      <div class="my-6">
        <div class="font-semibold">
          {{ activeEmbed.name }}
        </div>
        <div class="text-sm text-theme-500">
          {{ activeEmbed.desc }}
        </div>
      </div>
      <div class="my-8 grid grid-cols-12 gap-10">
        <div class="relative col-span-8 overflow-hidden">
          <div
            class="overflow-hidden rounded-md border border-slate-300 shadow-md"
          >
            <ElDeviceFrame
              ref="frameEl"
              device-mode="landscape"
              frame-id="embed-preview"
              :url="frameSrc"
            />
          </div>
        </div>
        <div class="col-span-4">
          <div class="mb-4 text-xs uppercase tracking-wide text-theme-400">
            settings
          </div>
          <div
            v-for="(opt, i) in opts"
            :key="i"
            class="my-4"
          >
            <ElOption
              v-bind="opt.props.value"
              :option="opt"
              :model-value="embedParams[opt.optionKey]"
              @update:model-value="updateEmbedParam(opt.optionKey, $event)"
            />
          </div>
          <div class="my-6">
            <div class="mb-3">
              <ElButton
                btn="slate"
                format="block"
                @click="handleCopyText(`#copy-embed`, 'embed')"
              >
                {{ copyText.embed }}
              </ElButton>
              <div class="text-[10px] text-theme-400 mt-2 text-center">
                Note: Kaption's client is required as well.
              </div>
            </div>
            <HighlightCode>
              <pre
                class="whitespace-pre rounded-md font-mono ring-1 ring-slate-300"
              ><code class="language-html focus:outline-primary-500 break-all whitespace-normal rounded-md !bg-theme-50 !p-2 text-[9px]" contenteditable="true">{{ embedHtml }}</code></pre>
            </HighlightCode>
            <input
              id="copy-embed"
              type="hidden"
              :value="embedHtml"
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mx-auto w-full max-w-screen-md">
      <div class="max-w-2xl">
        <div class="mb-2">
          <div class="font-semibold">
            Share Link
          </div>
          <div class="text-sm text-theme-500">
            Copy this link to share your form on social media, messaging apps,
            or via email.
          </div>
        </div>
        <div class="flex space-x-2">
          <InputUrl
            class="grow select-all"
            :model-value="kaptionForms.activeFormUrl.value"
            readonly
            @click="selectText($event)"
          />

          <ElButton
            btn="slate"
            class="whitespace-nowrap"
            @click="handleCopyText(`#copy-url`, 'url')"
          >
            {{ copyText.url }}
          </ElButton>
        </div>
        <input
          id="copy-url"
          ref="copyInput"
          type="hidden"
          :value="kaptionForms.activeFormUrl.value"
        >
      </div>

      <div class="embed-modes my-12 grid grid-cols-2 gap-6">
        <div
          v-for="(mode, i) in embedModes"
          :key="i"
          class="cursor-pointer rounded-md border border-slate-300 p-6 text-lg shadow-sm"
          :class="
            activeEmbed?.value && activeEmbed.value === mode.value
              ? 'bg-theme-100'
              : 'hover:shadow-md'
          "
          @click="updateEmbedParam('mode', mode.value)"
        >
          <div class="font-semibold">
            {{ mode.name }}
          </div>
          <div class="text-sm text-theme-500">
            {{ mode.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
