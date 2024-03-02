<script setup lang="ts">
import type {
  FactorRouter,
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  formatNumber,
  isValidUrl,
  notify,
  throttle,
  useService,
  vue,
} from '@factor/api'
import type { FactorStripe } from '@factor/plugin-stripe'
import NavPrimary from '@factor/ui/ElNavPrimary.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import InputSelectCustom from '@factor/ui/InputSelectCustom.vue'
import InputUrl from '@factor/ui/InputUrl.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElModalBanner from '@factor/ui/ElModalBanner.vue'
import ElModal from '@factor/ui/ElModal.vue'
import type ElDeviceFrame from '@factor/ui/ElBrowserFrameDevice.vue'
import ElProgress from '@factor/ui/ElProgress.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import PreviewFrame from './PreviewFrame.vue'
import PageChatShare from './PageChatShare.vue'
import VisualizerFrame from './VisualizerFrame.vue'
import type { DataSource } from './obj'
import { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

const frameEl = vue.shallowRef<InstanceType<typeof ElDeviceFrame> | null>(null)
const { factorUser, pageLinesAgent, factorRouter, factorStripe } = useService<{
  factorUser: FactorUser
  pageLinesAgent: PageLinesAgent
  factorRouter: FactorRouter
  factorStripe: FactorStripe
}>()
const agent = vue.shallowRef(new ChatAgent({ pageLinesAgent }))
const loading = vue.ref<boolean>(true)
const progress = vue.ref<number>(0)
const sending = vue.ref<boolean | string>('')
const activeDeviceMode = vue.ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const entryUrl = vue.ref('')
const addNewDataSourceType = vue.ref<'text' | 'url'>('text')
const routeAgentId = vue.computed<string>({
  get: () => factorRouter.params.value.agentId as string,
  set: val => factorRouter.goto('chat', { agentId: val }),
})

const routeTopicId = vue.computed<string>({
  get: () => factorRouter.params.value.topicId as 'data' | 'preview' | 'share',
  set: val =>
    factorRouter.goto('chat', { topicId: val as 'data' | 'preview' | 'share' }),
})

async function setData() {
  const r = await pageLinesAgent.findOne({
    agentId: routeAgentId.value,
  })

  if (r)
    agent.value = r

  loading.value = false
}

function addDataSource() {
  const type = addNewDataSourceType.value
  agent.value?.sources.value.push({ sourceType: type })
}

async function crawlUrl(args: { source: DataSource }) {
  const { source } = args
  const url = entryUrl.value

  const isValid = isValidUrl(url)

  if (!isValid) {
    notify.error('Please enter a valid URL')
    return
  }

  await source.crawl({ url })
}

async function manageUrls(args: {
  _action: 'addUrl' | 'deleteAll' | 'deleteUrl'
  source: DataSource
  item?: { url: string, length: number }
}) {
  const { _action, source } = args
  if (_action === 'addUrl') {
    source.sourceUrls.value.push({
      url: '',
      length: 0,
    })
  }
  else if (_action === 'deleteAll') {
    source.sourceUrls.value = []
  }
  else if (_action === 'deleteUrl') {
    const { item } = args
    if (item) {
      const v = source.sourceUrls.value
      source.sourceUrls.value = v.filter(c => c.url !== item.url)
    }
  }
}

vue.onMounted(async () => {
  await factorUser.pageInitialized()

  if (!routeAgentId.value)
    await factorRouter.goto('orgHome', {}, { create: 1 })

  vue.watch(
    () => routeAgentId.value,
    async (val) => {
      if (val)
        await setData()
    },
    { immediate: true },
  )

  vue.watch(
    () => agent.value?.options.value,
    throttle(async () => {
      sendAgentToFrame()
    }, 1000),
    { deep: true },
  )
})

function sendAgentToFrame() {
  if (frameEl.value) {
    const frameUtil = frameEl.value.frameUtility

    frameUtil?.sendMessage({
      message: { messageType: 'setAgent', data: agent.value.toConfig() },
    })
  }
}

async function send(context: 'upsert' | 'train'): Promise<void> {
  const active = agent.value
  if (!active || typeof document === 'undefined')
    return

  // const form = document.querySelector("#modelForm") as
  //   | HTMLFormElement
  //   | undefined

  // if (!form) throw new Error("No form found")

  // const valid = form?.reportValidity()

  // if (!valid) return

  if (
    context === 'train'
    && pageLinesAgent.usageLimits.value.characters
    < agent.value.totalCharacters.value
  ) {
    notify.error(
      'You have exceeded your plan\'s character training limit. Please upgrade your plan to train.',
    )
    return
  }

  sending.value = context
  progress.value = 0

  const int = setInterval(() => {
    if (progress.value < 90)
      progress.value += 1
  }, 2000)

  const r = await pageLinesAgent.requests.ManageAgent.projectRequest({
    _action: context,
    config: active.toConfig(),
  })

  if (r?.data)
    active?.update(r.data)

  if (r?.data?.agentId && r?.data?.agentId !== routeAgentId.value)
    routeAgentId.value = r.data.agentId

  clearInterval(int)
  progress.value = 100
  sending.value = false
}

const nav = vue.computed(() => {
//  const agentId = routeAgentId.value
  const menu: MenuItem[] = [
    // factorRouter.getRouteMenuItem('chat', {
    //   item: { name: 'Custom Data' },
    //   replace: { agentId, topicId: '' },
    // }),
    // factorRouter.getRouteMenuItem('chat', {
    //   item: { name: 'Settings' },
    //   replace: { agentId, topicId: 'settings' },
    // }),
    // factorRouter.getRouteMenuItem('chat', {
    //   item: { name: 'Design' },
    //   replace: { agentId, topicId: 'design' },
    // }),
    // factorRouter.getRouteMenuItem('chat', {
    //   item: { name: 'Preview' },
    //   replace: { agentId, topicId: 'preview' },
    // }),
    // factorRouter.getRouteMenuItem('chat', {
    //   item: { name: 'Share' },
    //   replace: { agentId, topicId: 'share' },
    // }),
  ]

  return menu
})

const iconList = [
  {
    name: 'AI',
    value: 'ai',
  },
  {
    name: 'Search',
    value: 'search',
  },
  {
    name: 'GPT',
    value: 'gpt',
  },
  {
    name: 'Chat',
    value: 'chat',
  },
  {
    name: 'Bot',
    value: 'bot',
  },
  {
    name: 'PageLines',
    value: 'pagelines',
    isDefault: true,
  },
  {
    name: 'Custom Image (Upload)',
    value: 'custom',
  },
]
</script>

<template>
  <AdminPage
    :nav="nav"
    :title="`Agent: ${agent.agentName.value || '--'}`"
    :loading="loading"
  >
    <template #nav>
      <NavPrimary :nav="nav" />
      <div class="space-x-2">
        <ElButton
          size="md"
          btn="default"
          :loading="sending === 'train'"
          @click.stop="send('train')"
        >
          <div>Train Model</div>
        </ElButton>
        <ElButton
          size="md"
          btn="default"
          :loading="sending === 'upsert'"
          @click.stop="send('upsert')"
        >
          <div>Save</div>
        </ElButton>
      </div>
    </template>
    <div
      v-if="!agent && !loading"
      class="text-theme-400 p-12 text-center text-xs uppercase tracking-wider"
    >
      Nothing Found
    </div>
    <div
      v-if="agent"
      class="relative transition-all"
      :class="sending ? 'opacity-60 pointer-events-none' : ''"
    >
      <transition-group name="list">
        <div v-if="routeTopicId === 'settings'" class="space-y-6">
          <ElForm
            v-if="agent"
            id="settingsForm"
            class="space-y-6"
          >
            <ElPanel title="Agent Settings">
              <div class="grid grid-cols-2 gap-12 lg:grid-cols-12">
                <div class="space-y-6 lg:col-span-7">
                  <ElInput
                    v-model="agent.agentName.value"
                    label="Reference Name"
                    sub-label="Used only for reference"
                    input="InputText"
                    placeholder="My Name"
                    required
                  />
                  <ElInput
                    v-model="agent.options.value.messagesInitial"
                    label="Initial Messages"
                    sub-label="Line or comma separated"
                    input="InputTextarea"
                    input-class="font-mono "
                    :rows="4"
                  />
                  <ElInput
                    v-model="agent.options.value.messagesSuggested"
                    label="Suggested Messages"
                    sub-label="Line or comma separated"
                    input="InputTextarea"
                    input-class="font-mono"
                    placeholder="How does your pricing work?\nWhat are your hours?"
                    :rows="4"
                  />

                  <ElInput
                    v-model="agent.options.value.displayName"
                    label="Agent Name"
                    sub-label="The name given to your chat agent"
                    input="InputText"
                    placeholder="AI Assistant"
                  />

                  <ElInput
                    v-model="agent.options.value.topic"
                    label="Topic"
                    description="Helpful for vague questions like 'What can you do?'"
                    sub-label="What is the general topic for discussion? This can help for vague questions."
                    input="InputText"
                    placeholder="Acme Inc. Support"
                  />

                  <ElInput
                    v-model="agent.options.value.description"
                    label="Topic Tagline / Description"
                    sub-label="Give a basic description of the topic"
                    input="InputText"
                    placeholder=""
                    :rows="4"
                  />

                  <ElInput
                    v-model="agent.options.value.emailReport"
                    label="Reporting Email Address"
                    sub-label="If the agent can't answer a question, it will email here you details about what's missing"
                    input="InputEmail"
                    placeholder="admin@example.com"
                  />

                  <ElInput
                    v-model="agent.options.value.emailContact"
                    label="Contact Email Address"
                    sub-label="If the agent can't answer a question, it will recommend contacting you at this email"
                    input="InputEmail"
                    placeholder="admin@example.com"
                  />

                  <ElInput
                    v-model="agent.basePrompt.value"
                    label="Base Prompt"
                    sub-label="(System Message) This is the base prompt that tells the model how to interact with your data."
                    input="InputTextarea"
                    input-class="font-mono "
                    :rows="5"
                    required
                  />
                </div>
                <div class="lg:col-span-5">
                  <PreviewFrame
                    :url="
                      pageLinesAgent.getVisualizerAgentUrl(agent.agentId.value)
                    "
                    :agent="agent"
                  />
                </div>
              </div>
            </ElPanel>
          </ElForm>
        </div>
        <div v-else-if="routeTopicId === 'design'" class="space-y-6">
          <ElForm
            v-if="agent"
            id="settingsForm"
            class="space-y-6"
          >
            <ElPanel title="Design and Messaging">
              <div class="grid grid-cols-2 gap-16 lg:grid-cols-12">
                <div class="lg:col-span-7">
                  <div class="space-y-6">
                    <ElInput
                      v-model="agent.options.value.position"
                      label="Position"
                      input="InputSelectCustom"
                      :list="[
                        {
                          name: 'Bottom / Right',
                          value: 'br',
                          isDefault: true,
                        },
                        {
                          name: 'Bottom / Left',
                          value: 'bl',
                        },
                        {
                          name: 'Bottom / Center',
                          value: 'bc',
                        },
                      ]"
                      required
                    />
                    <ElInput
                      v-model="agent.options.value.mode"
                      label="Mode"
                      input="InputSelectCustom"
                      :list="['modal', 'slideover', 'popover']"
                      required
                    />
                    <ElInput
                      v-model="agent.options.value.theme"
                      label="Theme"
                      input="InputSelectCustom"
                      :list="[
                        {
                          name: 'Light',
                          value: 'light',
                          isDefault: true,
                        },
                        {
                          name: 'Dark',
                          value: 'dark',
                        },
                      ]"
                      required
                    />
                    <ElInput
                      v-model="agent.options.value.colorAction"
                      label="Action Color"
                      sub-label="The color of the user's message"
                      input="InputColor"
                    />
                    <ElInput
                      v-model="agent.options.value.colorActionAlt"
                      label="Alt Action Color"
                      sub-label="Used for the agent's messages"
                      input="InputColor"
                    />
                    <ElInput
                      v-model="agent.options.value.colorButton"
                      label="Button Background Color"
                      input="InputColor"
                    />

                    <ElInput
                      v-model="agent.options.value.keyboardShortcut"
                      label="Activate Shortcut (Desktop Only)"
                      input="InputSelectCustom"
                      :list="[
                        {
                          name: '⌘ + K (Command)',
                          value: 'command',
                        },
                        {
                          name: '⌃ + K (Control)',
                          value: 'control',
                        },
                        {
                          name: '⌥ + K (Option)',
                          value: 'option',
                        },
                        {
                          name: '⇧ + K (Shift)',
                          value: 'shift',
                        },
                        {
                          name: 'No Keyboard Shortcut',
                          value: 'none',
                          isDefault: true,
                        },
                      ]"
                      required
                    />
                    <ElInput
                      v-model="agent.options.value.iconButton"
                      label="Button Icon"
                      input="InputSelectCustom"
                      :list="iconList"
                      required
                    />
                    <ElInput
                      v-if="agent.options.value.iconButton === 'custom'"
                      v-model="agent.options.value.iconButtonCustom"
                      label="Custom Button Icon / Image"
                      sub-label="The button users will click on to activate the agent"
                      input="InputMediaUpload"
                    />
                    <ElInput
                      v-model="agent.options.value.iconProfile"
                      label="Profile Icon"
                      input="InputSelectCustom"
                      :list="iconList"
                      required
                    />

                    <ElInput
                      v-if="agent.options.value.iconProfile === 'custom'"
                      v-model="agent.options.value.iconProfileCustom"
                      label="Custom Profile Icon"
                      sub-label="The profile picture for the chat agent"
                      input="InputMediaUpload"
                    />
                  </div>
                </div>
                <div class="lg:col-span-5">
                  <PreviewFrame
                    :url="pageLinesAgent.visualizerUrl.value"
                    :agent="agent"
                  />
                </div>
              </div>
            </ElPanel>
          </ElForm>
        </div>
        <div v-else-if="routeTopicId === 'preview'" class="space-y-6">
          <ElPanel title="Preview">
            <div class="space-y-6">
              <div
                class="relative flex h-full w-full flex-col justify-center overflow-scroll"
              >
                <!-- allow reset ui clicks over iframe (else iframe captures clicks) -->
                <div
                  v-if="false"
                  class="absolute inset-0 z-20 h-full w-full"
                />
                <div class="min-h-0 p-4">
                  <div
                    class="relative mx-auto py-4"
                    :class="
                      activeDeviceMode === 'mobile'
                        ? 'w-[60%] max-w-xs'
                        : activeDeviceMode === 'tablet'
                          ? 'w-[85%] max-w-md'
                          : 'w-full'
                    "
                  >
                    <VisualizerFrame
                      :device-mode="activeDeviceMode"
                      class="border-theme-300 rounded-md border"
                      :agent="agent"
                    />
                    <div
                      class="mt-4 flex justify-center space-x-2 text-[10px] uppercase"
                    >
                      <span
                        v-for="(mode, i) in (['desktop', 'tablet', 'mobile'] as const)"
                        :key="i"
                        class="inline-flex cursor-pointer select-none items-center rounded px-2 py-0.5 font-semibold"
                        :class="
                          activeDeviceMode === mode
                            ? 'bg-theme-400 text-theme-100'
                            : 'text-theme-400 bg-theme-200 hover:text-white hover:bg-primary-500'
                        "
                        @click.stop="activeDeviceMode = mode"
                      >
                        {{ mode }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElPanel>
        </div>
        <div v-else-if="routeTopicId === 'share'" class="space-y-6">
          <ElPanel title="Share and Embed">
            <PageChatShare :agent="agent" />
          </ElPanel>
        </div>
        <div v-else class="space-y-6">
          <ElPanel title="Custom Data">
            <div class="grid grid-cols-1 gap-8 text-sm md:grid-cols-2">
              <div class="">
                <div class="mb-6">
                  <div class="mb-3 font-bold">
                    Characters Added
                  </div>
                  <div class="font-brand text-3xl font-bold">
                    {{ formatNumber(agent.totalCharacters.value) }}
                  </div>
                </div>
              </div>
              <div class="max-w-prose">
                <div class="font-bold">
                  Agent Data
                </div>
                <div class="text-slate-600">
                  <p class="my-4">
                    Add custom data to your agent using the data sources below.
                    When users ask questions, the agent will use this data to
                    find answers.
                  </p>
                  <div class="mt-2 space-y-4">
                    <div class="relative">
                      <div class="relative flex items-center space-x-3">
                        <div>
                          <span
                            class="bg-theme-600 flex h-8 w-8 items-center justify-center rounded-md text-white ring-4 ring-white"
                          >
                            <div class="i-heroicons-check-badge text-2xl" />
                          </span>
                        </div>
                        <div class=" ">
                          <div class="text-theme-500 text-xs">
                            <RouterLink
                              :to="factorStripe.customerPortalUrl.value"
                              class="hover:text-primary-500"
                            >
                              Current Plan
                              <span class="opacity-70">(Change &#8599;)</span>
                            </RouterLink>
                          </div>
                          <div class="font-bold">
                            {{
                              pageLinesAgent.usageLimits.value.customer
                                ?.planName
                            }}
                            Plan &middot;
                            {{
                              formatNumber(
                                pageLinesAgent.usageLimits.value.characters,
                              )
                            }}
                            Characters
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElPanel>
          <ElPanel
            v-for="(source, i) in agent.sourcesFull.value"
            :key="i"
            :title="`Data Source (${source.sourceType.value})`"
          >
            <div class="space-y-6">
              <template v-if="source.sourceType.value === 'url'">
                <ElInput
                  label="Crawl Website for Links"
                  sub-label="Fetch web pages from starting URL or link to sitemap"
                >
                  <div class="my-2 flex space-x-6">
                    <InputUrl
                      v-model="entryUrl"
                      placeholder="https://www.example.com"
                    />
                    <ElButton
                      btn="primary"
                      :loading="source.sending.value"
                      @click="crawlUrl({ source })"
                    >
                      Fetch Urls
                    </ElButton>
                  </div>
                </ElInput>
                <ElInput
                  label="Included URLs"
                  sub-label="This will crawl all the links starting with the URL. Has to be server side rendered website"
                >
                  <div class="max-w-prose space-y-3">
                    <div
                      v-if="source.sourceUrls.value.length === 0"
                      class="text-theme-400 bg-theme-100 my-3 rounded-md p-2 text-xs"
                    >
                      None Added
                    </div>
                    <template v-else>
                      <div
                        v-for="(item, ii) in source.sourceUrls.value"
                        :key="ii"
                        class="flex items-center space-x-3"
                      >
                        <InputUrl v-model="item.url" />

                        <ElButton
                          class="text-theme-400"
                          @click="
                            manageUrls({ _action: 'deleteUrl', source, item })
                          "
                        >
                          <div class="i-heroicons-trash" />
                        </ElButton>
                        <div v-if="item.length" class="text-theme-500 text-xs">
                          {{ formatNumber(item.length) }}
                        </div>
                      </div>
                    </template>
                  </div>

                  <div class="mt-2 flex items-center space-x-3 pt-2">
                    <ElButton
                      class="text-theme-400"
                      btn="default"
                      size="sm"
                      @click="manageUrls({ _action: 'addUrl', source })"
                    >
                      Add URL
                    </ElButton>
                    <ElButton
                      v-if="source.sourceUrls.value.length > 0"
                      class="text-theme-400"
                      btn="default"
                      size="sm"
                      @click="manageUrls({ _action: 'deleteAll', source })"
                    >
                      Delete All
                    </ElButton>
                  </div>
                </ElInput>
              </template>
              <template v-if="source.sourceType.value === 'text'">
                <ElInput
                  v-model="source.sourceName.value"
                  label="Reference Name"
                  description="Helpful for management and debugging"
                  input="InputText"
                  placeholder="My Data"
                />
                <ElInput
                  v-model="source.sourceContent.value"
                  label="Content"
                  sub-label="Enter the text you want to use as a data source"
                  input="InputTextarea"
                  input-class="!max-w-full"
                  placeholder="Your content here"
                  :rows="12"
                />
              </template>
            </div>
          </ElPanel>

          <ElPanel>
            <ElInput label="Add New Data Source">
              <div class="flex space-x-4">
                <InputSelectCustom
                  v-model="addNewDataSourceType"
                  class="w-72"
                  :list="[
                    {
                      name: 'Website / Sitemap',
                      value: 'url',
                      isDefault: true,
                    },
                    {
                      name: 'Raw Text',
                      value: 'text',
                    },
                  ]"
                />
                <ElButton btn="primary" @click.stop="addDataSource()">
                  Add Data Source
                </ElButton>
              </div>
            </ElInput>
          </ElPanel>
        </div>
      </transition-group>
    </div>

    <ElModal :vis="sending === 'train'" modal-class="max-w-2xl p-12">
      <ElModalBanner
        class="items-center justify-center space-y-6 text-center"
        title="Embedding Data and Training Model"
        description="Uploading data and training model. This may take a second."
      >
        <template #sub>
          <ElProgress
            class="my-8"
            :message="progress > 52 ? 'Training' : 'Embedding'"
            :percent="progress"
          />
        </template>
      </ElModalBanner>
    </ElModal>
  </AdminPage>
</template>

<style lang="less">
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
