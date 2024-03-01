<script lang="ts" setup>
import type {
  FactorApp,
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  resetUi,
  useService,
  vue,
} from '@factor/api'
import InputUrl from '@factor/ui/InputUrl.vue'
import HighlightCode from '@factor/plugin-highlight-code/HighlightCode.vue'
import ElDeviceFrame from '@factor/ui/ElBrowserFrameDevice.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import InputChoice from '@factor/ui/InputChoice.vue'
import { InputOption } from '@factor/ui/inputs'
import { embedPosition } from '../plugin-embed/util'
import type { PageLinesTag } from '../plugin-tag'
import type { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

const props = defineProps({
  agent: {
    type: Object as vue.PropType<ChatAgent>,
    required: true,
  },
})
const { pageLinesAgent, factorRouter, factorApp, factorUser, pageLinesTag }
  = useService<{
    pageLinesAgent: PageLinesAgent
    factorRouter: FactorRouter
    factorApp: FactorApp
    factorUser: FactorUser
    pageLinesTag: PageLinesTag
  }>()
const shareType = vue.ref('button')
const frameEl = vue.ref<InstanceType<typeof ElDeviceFrame> | null>(null)
function selectText(event: MouseEvent) {
  const target = event.target as HTMLInputElement
  target.select()
}

const embedParams = vue.ref<Record<string, string>>({
  mode: 'modal',
  position: 'br',
  trigger: 'button',
})

function updateEmbedParam(key: string, value: string) {
  embedParams.value[key] = value
}

const embedModes = [
  {
    name: 'Modal',
    value: 'modal',
  },
  {
    name: 'Slideover',
    value: 'slideover',
  },
  {
    name: 'Popover',
    value: 'popover',
  },
]

const activeEmbed = vue.computed(() => {
  const m = embedParams.value.mode
  const v = embedModes.find(e => e.value === m)

  return v
})

const frameSrc = vue.computed(() => {
  const agentId = factorRouter.params.value.agentId as string
  const u = new URL(factorApp.appUrl.value)
  u.pathname = `/visualizer-embed/${agentId}`
  u.search = new URLSearchParams(embedParams.value).toString()
  return u.toString()
})

vue.watch(
  () => pageLinesAgent.editEmbedUrl.value,
  () => {
    setTimeout(() => {
      resetUi({ cause: 'embedUrl', scope: 'all' })
    }, 100)
  },
)

const copyText = vue.ref<Record<string, string>>({
  url: 'Copy URL',
  embed: 'Copy Embed HTML',
  client: 'Copy Client Code',
  agent: 'Copy Agent Code',
})

const embedHtml = vue.computed(() => {
  const trigger = embedParams.value.trigger || 'button'
  const mode = embedParams.value.mode || 'modal'
  const position = embedParams.value.position || 'br'

  const org = factorUser.activeOrganization.value
  const a = props.agent
  const out = {
    clientAgent: '',
    embed: `<iframe
  src="${a.tagEmbedUrl.value}"
  width="100%"
  height="700"
  frameborder="0"
></iframe>`,
    client:
      `<!-- PageLines Client Tag (${org?.organizationName || 'Org'}) -->
<script id="pl-client" src="${
        pageLinesTag.url(org?.organizationId || 'not_set').value
      }" defer><` + `/script>`, // break because parse error
    agent: `<!-- PageLines Agent Config (${a.agentName.value || 'Current'}) -->
<div data-pl-agent-id="${
      a.agentId.value
    }" data-pl-mode="${mode}" data-pl-position="${position}" data-pl-trigger="${trigger}" style="display:none;"></div>`,
  }

  out.clientAgent = `${out.client}\n\n${out.agent}`

  return out
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

  const orig = copyText.value[key]

  copyText.value = { ...copyText.value, [key]: 'Copied!' }

  setTimeout(() => {
    copyText.value = { ...copyText.value, [key]: orig }
  }, 2000)
}

const opts = vue.computed(() => {
  const inlineMode = embedParams.value.mode === 'inline'
  const out = [
    new InputOption({
      label: 'Display Mode',
      description: 'How the agent will display once activated',
      key: 'mode',
      input: 'InputSelectCustom',
      props: {
        list: embedModes,
      },
    }),

    new InputOption({
      label: 'Button Position',
      key: 'position',
      input: 'InputSelect',
      props: {
        list: embedPosition,
      },
      isVisible: (
        ['button', 'bubble'].includes(embedParams.value.trigger)
        && !inlineMode
      ),
    }),
  ]

  return out
})

vue.onMounted(async () => {

})
</script>

<template>
  <div class=" ">
    <div v-if="activeEmbed?.value" class="mx-auto w-full max-w-screen-lg pb-32">
      <div class="mx-auto max-w-prose">
        <InputChoice
          v-model="shareType"
          :list="[
            { name: 'Chat Button', value: 'button' },
            { name: 'Website Embed', value: 'embed' },
            { name: 'Direct Link', value: 'link' },
          ]"
        />

        <div v-if="shareType === 'embed'">
          <div class="font-brand my-6">
            <div class="font-brand text-2xl font-bold">
              Direct Embed
            </div>
            <div>Embed inline in your website.</div>
          </div>
          <HighlightCode class="my-6">
            <pre
              class="ring-theme-300 whitespace-pre rounded-md font-mono ring-1"
            ><code class="language-html focus:outline-primary-500 rounded-md !p-4 text-xs" contenteditable="true">{{ embedHtml.embed }}</code></pre>
          </HighlightCode>
          <input
            id="copy-embed"
            type="hidden"
            :value="embedHtml.embed"
          >
          <div class="mb-3">
            <ElButton
              btn="primary"
              @click="handleCopyText(`#copy-embed`, 'embed')"
            >
              {{ copyText.embed }}
            </ElButton>
          </div>
        </div>

        <div v-else-if="shareType === 'link'" class="">
          <div class="font-brand my-6">
            <div class="font-brand text-2xl font-bold">
              Direct Link
            </div>
            <div>Share this direct link to a page hosting the agent.</div>
          </div>
          <div class="max-w-2xl">
            <div class="flex space-x-2">
              <InputUrl
                class="grow select-all"
                :model-value="agent.tagEmbedUrl.value"
                readonly
                @click="selectText($event)"
              />

              <ElButton
                btn="primary"
                class="whitespace-nowrap"
                @click="handleCopyText(`#copy-url`, 'url')"
              >
                {{ copyText.url }}
              </ElButton>
            </div>
            <input
              id="copy-url"
              type="hidden"
              :value="agent.tagEmbedUrl.value"
            >
          </div>
        </div>

        <div v-else class="space-y-12 text-sm">
          <div class="space-y-6">
            <div class="font-brand my-6">
              <div class="font-brand text-xl font-bold">
                Chat Button
              </div>
              <div>
                To add a button to the on your website add this script tag to
                your html or tag manager.
              </div>
            </div>

            <div class="my-6">
              <div class="font-brand my-6">
                <div class="font-brand text-base font-bold">
                  Step 1. Add PageLines Client to Head
                </div>
                <div>
                  Add PageLines client tag to all pages in head or tag manager.
                </div>
              </div>
              <HighlightCode>
                <pre
                  class="whitespace-pre rounded-md font-mono"
                ><code class="language-html focus:outline-primary-500 rounded-md !p-6 text-xs shadow-inner" contenteditable="true">{{ embedHtml.client }}</code></pre>
              </HighlightCode>
              <input
                id="copy-client"
                type="hidden"
                :value="embedHtml.client"
              >
              <div class="my-3">
                <ElButton
                  btn="primary"
                  size="md"
                  @click="handleCopyText(`#copy-client`, 'client')"
                >
                  {{ copyText.client }}
                </ElButton>
              </div>
            </div>

            <div class="my-6">
              <div class="font-brand my-6">
                <div class="font-brand text-base font-bold">
                  Step 2. Add Agent Tag to Page
                </div>
                <div>
                  Add the agent tag to the page you want the button to appear
                </div>
              </div>
              <HighlightCode>
                <pre
                  class="whitespace-pre rounded-md font-mono"
                ><code class="language-html focus:outline-primary-500 rounded-md !p-6 text-xs shadow-inner" contenteditable="true">{{ embedHtml.agent }}</code></pre>
              </HighlightCode>
              <input
                id="copy-agent"
                type="hidden"
                :value="embedHtml.agent"
              >
              <div class="my-3">
                <ElButton
                  btn="primary"
                  size="md"
                  @click="handleCopyText(`#copy-agent`, 'agent')"
                >
                  {{ copyText.agent }}
                </ElButton>
              </div>
            </div>
          </div>

          <div>
            <div class="font-brand">
              <div class="font-brand text-xl font-bold">
                Button Settings
              </div>
              <div>Control the behavior of your embeddable button and chat</div>
            </div>
            <div class="">
              <div
                v-for="(opt, i) in opts"
                :key="i"
                class="my-4"
              >
                <ElInput
                  v-if="opt.key"
                  v-bind="opt.props.value"
                  :input="opt.input"
                  :model-value="embedParams[opt.key]"
                  @update:model-value="updateEmbedParam(opt.key, $event)"
                />
              </div>
            </div>
          </div>

          <div>
            <div class="font-brand my-6">
              <div class="font-brand text-xl font-bold">
                Button Preview
              </div>
              <div>
                Based on your settings, the button will appear as below.
                <a
                  :href="frameSrc"
                  class="text-primary-500 italic"
                  target="_blank"
                >View full screen &rarr;</a>
              </div>
            </div>
            <div
              class="border-theme-300 overflow-hidden rounded-md border shadow-md"
            >
              <ElDeviceFrame
                ref="frameEl"
                device-mode="landscape"
                frame-id="embed-preview"
                :url="frameSrc"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
