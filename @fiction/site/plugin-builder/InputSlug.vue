<script lang="ts" setup>
import type { ResponseStatus, ValidationReason } from '@fiction/core'
import type { Site } from '../site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import { textInputClasses } from '@fiction/ui/inputs/theme'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const initialValue = vue.ref(props.modelValue)
const initialStatus = initialValue.value === '' ? 'unknown' : 'success'
const status = vue.ref<ResponseStatus>(initialStatus)
const reason = vue.ref<ValidationReason>(initialStatus)
const validEl = vue.ref<HTMLInputElement>()
const isValid = vue.ref(-1)
const reasonText = vue.computed(() => {
  const r = {
    short: 'Too short',
    long: 'Too long',
    invalid: 'Invalid characters',
    success: 'Available',
    current: 'Current',
    error: 'There was a problem',
    loading: 'Checking...',
    taken: 'Not available',
  } as const

  return r[reason.value as keyof typeof r]
})

async function handleEmit(target: EventTarget | null) {
  const el = target as HTMLInputElement

  const value = el.value

  if (!value)
    return

  if (value === initialValue.value) {
    status.value = 'success'
    reason.value = 'current'
  }
  else if (value.length <= 1) {
    status.value = 'fail'
    reason.value = 'short'
  }
  else if (value.length > 25) {
    status.value = 'fail'
    reason.value = 'long'
  }
  else if (/[^\w-]/.test(value)) {
    status.value = 'fail'
    reason.value = 'invalid'
  }
  else {
    status.value = 'loading'

    try {
      // const r = { data: {} } // await fictionDb.requests.CheckUsername.request({ table: props.table, column: props.column, value })

      // status.value = r.data?.available || 'error'
      // reason.value = r.data?.reason ?? 'unknown'
    }
    catch (e) {
      status.value = 'error'
      reason.value = 'error'
      throw e
    }
  }

  if (status.value === 'success') {
    validEl.value?.setCustomValidity('')
    isValid.value = 1
  }
  else {
    validEl.value?.setCustomValidity(reasonText.value)
    isValid.value = 0
  }
  emit('update:modelValue', value)
}

const icon = vue.computed(() => {
  const i = {
    success: { icon: 'i-tabler-check', color: 'text-green-500' },
    error: { icon: 'i-tabler-exclamation-circle', color: 'text-red-500' },
    loading: { icon: 'i-tabler-reload animate-spin', color: 'text-theme-400' },
    fail: { icon: 'i-tabler-x', color: 'text-red-500' },
    unknown: { icon: 'i-tabler-question-circle', color: 'text-theme-400' },
  }

  return i[status.value]
})

const showSetHomeModal = vue.ref(false)

async function setNewHomepage() {
  await props.site.setEditPageAsHome()
}

const isHome = vue.computed(() => props.modelValue === '_home')
</script>

<template>
  <div>
    <div class="space-y-2">
      <div v-if="isHome">
        <XButton theme="green" :no-hover="true" size="sm" icon="i-tabler-home" rounding="full">
          Current Home Page
        </XButton>
      </div>
      <div v-else class="flex items-center space-x-2 border" :class="textInputClasses({ inputClass })">
        <input
          ref="validEl"
          class="grow appearance-none border-none bg-transparent focus:outline-none focus:ring-0 focus:border-transparent p-0 leading-[1]"
          :style="{ fontSize: 'inherit' }"
          type="text"
          :value="modelValue"
          :placeholder="placeholder"
          spellcheck="false"
          :data-is-valid="isValid"
          @input="handleEmit($event.target)"
        >
        <div class="text-lg" :class="icon.color">
          <div :class="icon.icon" />
        </div>
      </div>
      <div class="flex justify-between space-x-3">
        <div v-if="reasonText" class="text-[10px] font-sans text-theme-400">
          {{ site?.frame.displayUrlBase.value }}/{{ isHome ? '' : modelValue }}
        </div>
        <div v-if="reasonText && !isHome" class="text-[10px] font-sans text-theme-400">
          {{ reasonText }}
        </div>
      </div>
      <div v-if="!isHome">
        <XButton rounding="full" tag="div" size="xs" icon="i-tabler-home" @click.stop="showSetHomeModal = true">
          Set As Homepage
        </XButton>
        <ElModalConfirm
          v-model:vis="showSetHomeModal"
          title="Confirm New Homepage"
          sub="Sure you want to make this page the homepage?"
          @confirmed="setNewHomepage()"
        />
      </div>
    </div>
  </div>
</template>
