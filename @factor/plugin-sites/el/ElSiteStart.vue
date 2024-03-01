<script lang="ts" setup>
import type { FactorRouter, StepConfig, StepItem } from '@factor/api'
import { notify, resetUi, useService, vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElStepNav from '@factor/ui/ElStepNav.vue'
import type { FactorSites } from '..'
import { requestManageSite } from '../load'
import type { Card } from '../card'
import ElThemeSelect from './ElThemeSelect.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const serv = useService<{ factorSites: FactorSites, factorRouterSites: FactorRouter }>()

const { factorSites, factorRouter, factorRouterSites } = serv

const form = vue.ref({
  title: '',
  themeId: '',
})
const isLoading = vue.ref(false)

function creationError(data?: unknown) {
  notify.error(
    'There was a problem.',
    { data, more: 'Developers have been notified.' },
  )

  resetUi()
}

async function requestCreateSite() {
  isLoading.value = true
  const f = form.value
  try {
    const fields = { title: f.title, themeId: f.themeId || 'minimal' }
    const { site } = await requestManageSite({ _action: 'create', fields, factorSites, siteRouter: factorRouterSites, caller: 'ElSiteStart', siteMode: 'editable' })
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
        name: 'Give It A Name',
        desc: 'This is used for reference.',
        key: 'name',
        class: 'max-w-lg',
        isNeeded: true,
      },
      {
        name: `Select Theme`,
        desc: 'A theme provides all the UI and styling for your website.',
        key: 'theme',
        actionText: 'Create Site',
        class: 'max-w-screen-md',
        isNeeded: true,
        isLoading: isLoading.value,
        onClick: () => requestCreateSite(),
      },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-lg"
    style-class="none"
  >
    <ElStepNav v-slot="{ step }" :step-config="stepConfig">
      <div v-if="step.key === 'name'">
        <ElInput
          v-model="form.title"
          input="InputText"
          placeholder="My Site"
        />
      </div>
      <div v-else-if="step.key === 'theme'">
        <ElThemeSelect v-model="form.themeId" required />
      </div>
    </ElStepNav>
  </ElModal>
</template>

<style lang="less"></style>
