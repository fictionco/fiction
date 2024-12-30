<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { validateForm } from '@fiction/ui/inputs/utils'

const props = defineProps<{
  // Modal props
  vis: boolean
  modalClass?: string
  title?: string
  subTitle?: string

  // Form props
  modelValue?: Record<string, any>
  options: InputOption[]
  formError?: string
  stateKey?: string
  loading?: boolean

  cancelLabel?: string
  buttons?: ActionButton[]
}>()

const emit = defineEmits<{
  (event: 'update:vis', value: boolean): void
  (event: 'update:modelValue', value: Record<string, any>): void
}>()

const formRef = vue.ref<HTMLFormElement>()

function closeModal() {
  emit('update:vis', false)
}

const modalButtons = vue.computed(() => props.buttons || [])
const hasCustomActions = vue.computed(() => modalButtons.value.length > 0)

const defaultModalClass = 'max-w-screen-md p-12'
const finalModalClass = props.modalClass || defaultModalClass

const context = vue.computed(() => {
  const el = formRef.value

  return {
    validate: (args: { reportValidity?: boolean }) => validateForm({ el, ...args }),
  }
})
</script>

<template>
  <ElModal
    :vis="vis"
    :modal-class="finalModalClass"
    @update:vis="closeModal"
  >
    <div v-if="title || subTitle" class="mb-6 space-y-1 border-b border-theme-200 dark:border-theme-700 pb-4">
      <div v-if="title" class="text-xl font-medium">
        {{ title }}
      </div>
      <div v-if="subTitle" class="text-base text-theme-500 dark:text-theme-400">
        {{ subTitle }}
      </div>
    </div>

    <form
      ref="formRef"
      class="space-y-8 mx-auto"
    >
      <FormEngine
        :model-value="modelValue"
        ui-size="lg"
        input-wrap-class="w-full"
        :options="options"
        :state-key="stateKey"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <div class="flex border-t border-theme-200/70 dark:border-theme-700/70 pt-4 mt-8 px-4" :class="hasCustomActions ? 'justify-between' : 'justify-center'">
        <div>
          <XButton
            size="lg"
            theme="default"
            @click.prevent="closeModal"
          >
            {{ cancelLabel || 'Cancel' }}
          </XButton>
        </div>

        <div v-if="hasCustomActions" class="gap-4 flex">
          <XButton
            v-for="(action, i) in modalButtons"
            :key="i"
            :design="action.design || 'solid'"
            :theme="action.theme || 'theme'"
            :loading="action.loading"
            size="lg"
            :href="action.href"
            :data-test-id="action.testId"
            @click.stop="action.onClick?.({ item: action, event: $event, context })"
          >
            {{ action.label }}
          </XButton>
        </div>
      </div>
    </form>
  </ElModal>
</template>
