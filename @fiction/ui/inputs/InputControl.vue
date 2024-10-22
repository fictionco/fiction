<script lang="ts" setup>
import type { InputOption } from '.'
import { type ActionButton, isPlainObject, type MediaObject, toLabel, vue, waitFor } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import ElModal from '../ElModal.vue'
import XIcon from '../media/XIcon.vue'
import XMedia from '../media/XMedia.vue'
import FormEngine from './FormEngine.vue'

const { modelValue, controlOption } = defineProps<{
  modelValue?: any
  controlOption: InputOption
  options?: InputOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: any): void
}>()

const tempValue = vue.ref(vue.toRaw(modelValue))

vue.onMounted(async () => {
  await waitFor(200)
})

const v = vue.computed(() => controlOption.valueDisplay.value)

function updateTempValue(val: any) {
  tempValue.value = val
}

function saveChanges() {
  emit('update:modelValue', tempValue.value)
  controlOption.isModalOpen.value = false
}

function openModal() {
  tempValue.value = vue.toRaw(modelValue)
  controlOption.isModalOpen.value = true
}

function cancelChanges() {
  tempValue.value = vue.toRaw(modelValue)
  controlOption.isModalOpen.value = false
}

const modalActions = vue.computed<ActionButton[]>(() => {
  const optionModalActions = controlOption.modalActions.value
  const baseTestId = controlOption.settings.testId || 'input-control'
  if (!optionModalActions) {
    return [
      {
        testId: `${baseTestId}-modal-apply`,
        name: 'Apply Changes',
        theme: 'primary',
        onClick: saveChanges,
      },
    ]
  }
  else {
    return optionModalActions
  }
})

const actions = vue.computed<ActionButton[]>(() => {
  const optionActions = controlOption.actions.value
  const baseTestId = controlOption.settings.testId || 'input-control'
  if (!optionActions) {
    return [
      {
        testId: `${baseTestId}-edit-button`,
        name: 'Edit',
        theme: 'theme',
        onClick: openModal,
        icon: { class: 'i-tabler-pencil' },
      },
    ]
  }
  else {
    return optionActions
  }
})
</script>

<template>
  <div>
    <div class="relative flex gap-4 lg:gap-6 ">
      <div v-if="controlOption.settings.icon" class="size-8 shrink-0 lg:size-10 rounded-xl flex justify-center items-center">
        <XIcon class="size-[80%]" :media="controlOption.settings.icon" />
      </div>
      <div class="grow min-w-0">
        <div v-if="v" class="flex items-center gap-4 text-sm lg:text-base leading-[1] font-normal text-theme-500 dark:text-theme-400">
          <div>{{ controlOption.label }}</div>
        </div>
        <div class="my-1 text-lg lg:text-xl font-semibold break-words">
          <div v-if="!v">
            {{ controlOption.label }}
          </div>
          <div v-else-if="v?.format === 'media' && isPlainObject(v?.data)" class="my-2">
            <XMedia class="size-14" :media="(v?.data as MediaObject)" />
          </div>
          <div v-else>
            {{ v?.data || 'Not Set' }}
          </div>
        </div>
        <div class="flex gap-2 items-center mt-3">
          <XButton
            v-if="v?.status"
            padding="py-1"
            hover="none"
            design="textOnly"
            :icon="v?.status === 'ready' ? 'i-tabler-check' : v?.status === 'incomplete' ? 'i-tabler-x' : 'i-tabler-circle-plus'"
            :theme="v?.status === 'ready' ? 'green' : v?.status === 'incomplete' ? 'rose' : 'theme'"
            size="md"
          >
            {{ toLabel(v?.status) }}
          </XButton>
          <template v-if="v?.message || controlOption.subLabel.value">
            <div v-if="v?.status" class="text-theme-500">
              &middot;
            </div>
            <div class="text-sm text-theme-400 dark:text-theme-500">
              {{ v?.message || controlOption.subLabel.value }}
            </div>
          </template>
        </div>
      </div>
      <div class="space-x-3 shrink-0">
        <XButton
          v-for="(action, ii) in actions"
          :key="ii"
          :data-test-id="action.testId"
          :design="action.design || 'solid'"
          :theme="action.theme || 'theme'"
          :size="action.size || 'lg'"
          :loading="action.loading"
          :href="action.href"
          :icon="action.icon"
          :icon-after="action.iconAfter"
          :disabled="action.disabled"
          @click.stop="action.onClick ? (action.onClick({ item: action, event: $event, props: { controlOption } })) : ''"
        >
          {{ action.name }}
        </XButton>
      </div>
    </div>
    <ElModal v-model:vis="controlOption.isModalOpen.value" modal-class="max-w-screen-md p-12">
      <div>
        <div class="mb-6 space-y-1 border-b border-theme-200 dark:border-theme-700 pb-4">
          <div class="text-xl font-medium">
            {{ controlOption.label }}
          </div>
          <div class="text-base text-theme-500 dark:text-theme-400">
            {{ controlOption.subLabel }}
          </div>
        </div>
        <FormEngine
          :model-value="tempValue"
          state-key="settingsTool"
          input-wrap-class="w-full"
          ui-size="lg"
          :options="controlOption.options.value || []"
          :disable-group-hide="true"
          :data-value="JSON.stringify(tempValue)"
          @update:model-value="updateTempValue"
        />
        <div
          class="flex border-t border-theme-200/70 dark:border-theme-700/70 pt-4 mt-8"
          :class="modalActions.length ? 'justify-between' : 'justify-center'"
        >
          <div>
            <XButton size="lg" theme="default" @click="cancelChanges">
              {{ controlOption.modalActions.value?.length ? 'Cancel' : 'Close' }}
            </XButton>
          </div>
          <div v-if="modalActions.length" class="gap-4 flex">
            <XButton
              v-for="(action, ii) in modalActions"
              :key="ii"
              design="solid"
              :theme="action.theme || 'theme'"
              :loading="action.loading"
              size="lg"
              :href="action.href"
              :data-test-id="action.testId"
              @click.stop="action.onClick ? (action.onClick({ item: action, event: $event, props: { controlOption } })) : ''"
            >
              {{ action.name }}
            </XButton>
          </div>
        </div>
      </div>
    </ElModal>
  </div>
</template>
