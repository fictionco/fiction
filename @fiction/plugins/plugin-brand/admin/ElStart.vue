<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '..'
import type { TableBrand } from '../schema.js'
import { useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const { fictionBrand, fictionEnv, fictionUser } = useService<{ fictionBrand: FictionBrand }>()

const form = vue.ref<Partial<TableBrand>>({
  title: '',
})
const isLoading = vue.ref(false)

async function start() {
  isLoading.value = true
  try {
    const fields = form.value

    const response = await fictionBrand.requests.ManageBrandGuide.projectRequest({
      _action: 'create',
      fields,
    })

    const brandId = response.data?.[0].brandId

    if (response.status === 'success' && brandId) {
      await props.card.goto(`/brand?brandId=${brandId}`)
    }
    else {
      fictionEnv.events.emit('notify', { message: 'Failed to create brand guide', type: 'error' })
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        title: 'Name Your Brand Guide',
        subTitle: 'What would you like to call this brand guide?',
        key: 'title',
        class: 'max-w-lg',
        isNeeded: true,
        onClick: () => start(),
      },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-md"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav v-slot="{ step }" :step-config="stepConfig">
      <div v-if="step.key === 'title'" class="">
        <ElInput
          v-model="form.title"
          data-test-id="title-input"
          input="InputText"
          placeholder="e.g., My Personal Guidelines"
          ui-size="lg"
          required
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
