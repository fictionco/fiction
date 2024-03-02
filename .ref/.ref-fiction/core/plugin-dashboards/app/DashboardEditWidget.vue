<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElSlideover from '@factor/ui/ElSlideOver.vue'
import { emitEvent, resetUi, useService, vue } from '@factor/api'
import type { ClientWidget } from '../widget'
import type { FactorDashboard } from '..'

const props = defineProps({
  widget: { type: Object as vue.PropType<ClientWidget>, default: () => ({}) },
})
const emit = defineEmits(['update'])
const { factorDashboard } = useService<{
  factorDashboard: FactorDashboard
}>()
const sending = vue.ref(false)

const form = vue.ref<{ widgetKey?: string }>({})

vue.watch(
  () => props.widget,
  (v) => {
    if (v)
      form.value = props.widget || {}
  },
)

const widgetList = vue.computed(() => {
  return factorDashboard.widgets.map((widget) => {
    return {
      name: widget.title.value,
      desc: widget.description.value,
      value: widget.widgetKey,
    }
  })
})

function updateWidget(): void {
  // detach and prevent the ref from sticking (hard to debug)
  const v = JSON.parse(JSON.stringify(form.value)) as { widgetKey?: string }

  emit('update', v)
  resetUi({ scope: 'all', cause: 'updateWidget' })
}

function deleteWidget(): void {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    const el = document.querySelector(`[wid="${props.widget.hashId.value}"]`)
    el?.remove()
    emitEvent('widgetLayout')
  }
}
</script>

<template>
  <ElSlideover name="newWidget">
    <div
      class="text-theme-400 bg-theme-100 flex h-12 w-12 items-center justify-center rounded-full"
    >
      <div class="i-carbon-dashboard-reference text-2xl" />
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Edit Dashboard Component
      </h2>
      <p class="text-theme-500 mt-2">
        Settings for "{{ widget.title }}" Dashboard Component
      </p>
    </div>

    <ElForm
      :data="form"
      spellcheck="false"
      class="max-w-md"
      @submit="updateWidget()"
    >
      <ElInput
        v-model="form.widgetKey"
        class="my-6"
        input="InputSelectCustom"
        label="Select Widget"
        :list="widgetList"
        required
      />

      <div class="mt-4 flex items-center">
        <ElButton
          btn="primary"
          input="submit"
          :loading="sending"
        >
          Save
        </ElButton>
      </div>

      <ElInput
        label="Delete Widget"
        required
        class="mt-12"
      >
        <ElButton
          class="my-2"
          btn="red"
          @click="deleteWidget()"
        >
          Delete
        </ElButton>
      </ElInput>
    </ElForm>
  </ElSlideover>
</template>
