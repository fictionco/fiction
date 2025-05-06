<script lang="ts" setup>
import type { FictionRouter, StepConfig, StepItem } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { TableSiteConfig } from '../tables'
import { resetUi, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { requestManageSite } from '../load'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const serv = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter }>()

const { fictionSites, fictionRouterSites, fictionEnv, fictionUser } = serv

const form = vue.ref<Partial<TableSiteConfig>>({ title: fictionUser.activeOrganization.value?.orgName, themeId: 'base', userConfig: { } })
const isLoading = vue.ref(false)

async function requestCreateSite() {
  isLoading.value = true
  try {
    const fields = form.value
    const { site, response } = await requestManageSite({ _action: 'create', fields, fictionSites, siteRouter: fictionRouterSites, caller: 'ElSiteStart', siteMode: 'editable' })

    if (response?.status !== 'success' || !site?.siteId) {
      console.error('requestManageSite error', response)
      fictionEnv.events.emit('notify', { type: 'error', message: 'There was a problem.' })
      return
    }

    await props.card.goto({ path: '/edit-site', query: { siteId: site?.siteId } })
  }
  catch (error) {
    fictionEnv.events.emit('notify', { type: 'error', message: 'There was a problem.' })

    resetUi({ scope: 'all', cause: 'requestManageSite error', trigger: 'manualReset' })
    console.error(error)
  }

  isLoading.value = false
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        title: 'Create a New Site',
        subTitle: 'Give it a name.',
        placeholder: 'Enter a site name',
        key: 'name',
        class: 'max-w-lg',
        onClick: async () => requestCreateSite(),
      },
      // {
      //   title: `Select Your Theme`,
      //   subTitle: 'This is the starting point - you can customize everything later.',
      //   key: 'theme',
      //   class: 'max-w-screen-xl',
      //   isLoading: isLoading.value,

      //   button: { label: 'Create Site' },
      // },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-xl"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav
      v-slot="{ step }"
      :step-config="stepConfig"
      data-test-id="createSiteModal"
      :classes="{ step: 'bg-theme-0 dark:bg-theme-950 text-theme-900 dark:text-theme-0' }"
    >
      <div v-if="step.key === 'name'">
        <ElInput
          v-model="form.title"
          input="InputText"
          :placeholder="step.placeholder"
          ui-size="lg"
          data-test-id="siteName"
          required
        />
      </div>
      <div v-else-if="step.key === 'theme'">
        <ElThemeSelect v-model="form.themeId" required :card />
      </div>
    </ElStepNav>
  </ElModal>
</template>
