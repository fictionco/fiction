<script lang="ts" setup>
import type { FictionRouter, StepConfig, StepItem } from '@fiction/core'
import { getNested, notify, resetUi, setNested, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import { InputOption } from '@fiction/ui'
import type { FictionSites } from '..'
import { requestManageSite } from '../load'
import type { Card } from '../card'
import type { TableSiteConfig } from '../tables'
import { imageStyle } from '../util'
import ElThemeSelect from './ElThemeSelect.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const serv = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter }>()

const { fictionSites, fictionRouterSites } = serv

const form = vue.ref<Partial<TableSiteConfig>>({
  title: '',
  themeId: '',
  userConfig: { },
})
const isLoading = vue.ref(false)

function creationError(data?: unknown) {
  notify.error('There was a problem.', { data, more: 'Developers have been notified.' })

  resetUi()
}

async function requestCreateSite() {
  isLoading.value = true
  try {
    const fields = form.value
    const { site } = await requestManageSite({ _action: 'create', fields, fictionSites, siteRouter: fictionRouterSites, caller: 'ElSiteStart', siteMode: 'editable' })
    await props.card.goto({ path: '/edit-site', query: { siteId: site?.siteId } })
  }
  catch (error) {
    creationError(error)
  }

  isLoading.value = false
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        name: 'Create A New Site',
        desc: 'Give it a name...',
        key: 'name',
        class: 'max-w-lg',
        isNeeded: true,
      },
      {
        name: `Select Theme`,
        desc: 'A theme provides all the UI and styling for your website.',
        key: 'theme',
        class: 'max-w-screen-md',
        isNeeded: true,
        isLoading: isLoading.value,
        onClick: () => requestCreateSite(),
      },
      // {
      //   name: `Generation Settings`,
      //   desc: 'Some basic information to help the AI generate content.',
      //   key: 'generation',
      //   actionText: 'Create Site',
      //   class: 'max-w-lg',
      //   isNeeded: true,
      //   isLoading: isLoading.value,
      //   onClick: () => requestCreateSite(),
      // },
    ]

    return out
  }),
}

const opts = [
  new InputOption({
    key: 'userConfig.objectives.about',
    label: 'About the Website',
    description: 'The primary focus for the website? Who or what is it about?',
    input: 'InputTextarea',
    placeholder: 'A personal website for a [NAME] a to serve as a portfolio, blog, and personal brand tool...',
    props: { rows: 3 },
  }),
  new InputOption({
    key: 'userConfig.objectives.targetCustomer',
    label: 'Target Customer',
    description: 'Who is the target customer(s) for the website? What are their needs?',
    input: 'InputTextarea',
    placeholder: 'Small business owners in need of a professional website.',
    props: { rows: 3 },
  }),
  new InputOption({
    key: 'userConfig.objectives.imageStyle',
    label: 'Image Style',
    input: 'InputSelectCustom',
    list: imageStyle,
  }),
]
</script>

<template>
  <ElModal
    modal-class="max-w-screen-md"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav v-slot="{ step }" :step-config="stepConfig">
      <div v-if="step.key === 'name'" class="">
        <ElInput
          v-model="form.title"
          input="InputText"
          placeholder="Site Name"
          input-class="p-4 text-lg"
        />
      </div>
      <div v-else-if="step.key === 'generation'" class="space-y-4">
        <div v-for="(opt, i) in opts" :key="i">
          <ElInput
            v-bind="opt.outputProps.value"
            :input="opt.input.value"
            input-class="bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-25 border-theme-300 dark:border-theme-600"
            :model-value="getNested({ path: opt.key.value, data: form })"
            @update:model-value="form = setNested({ path: opt.key.value, data: form, value: $event })"
          />
        </div>
      </div>
      <div v-else-if="step.key === 'theme'">
        <ElThemeSelect v-model="form.themeId" required />
      </div>
    </ElStepNav>
  </ElModal>
</template>
