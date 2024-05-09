<script lang="ts" setup>
import type { ResponseStatus, ValidationReason } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import type { CheckColumnValue } from '@fiction/core/plugin-db/endpoint'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String], default: '' },
  placeholder: { type: [String], default: '' },
  beforeInput: { type: String, default: '' },
  afterInput: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  table: { type: String, required: true },
  columns: { type: Array as vue.PropType<CheckColumnValue[]>, default: () => [] },
  maxLength: { type: Number, default: 100 },
  minLength: { type: Number, default: 3 },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const { fictionDb } = useService()
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
    reserved: 'Reserved',
  } as const

  return r[reason.value as keyof typeof r]
})

async function handleEmit(target: EventTarget | null) {
  const el = target as HTMLInputElement

  const value = el.value

  const columns = props.columns.map(c => ({ ...c, value: !c.value ? value : c.value }))

  emit('update:modelValue', value)

  if (!value)
    return

  if (value === initialValue.value) {
    status.value = 'success'
    reason.value = 'current'
  }
  else if (value.length < props.minLength) {
    status.value = 'fail'
    reason.value = 'short'
  }
  else if (value.length > props.maxLength) {
    status.value = 'fail'
    reason.value = 'long'
  }
  else if (/[^a-zA-Z0-9-_]/.test(value)) {
    status.value = 'fail'
    reason.value = 'invalid'
  }
  else {
    status.value = 'loading'

    try {
      const r = await fictionDb.requests.CheckUsername.request({ table: props.table, columns })

      status.value = r.data?.available || 'error'
      reason.value = r.data?.reason ?? 'unknown'
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
</script>

<template>
  <div>
    <div class="flex items-center space-x-2 " :class="textInputClasses({ inputClass: [inputClass, 'py-0'].join(' ') })" tabindex="-1">
      <div v-if="beforeInput" class="opacity-50 py-2">
        {{ beforeInput }}
      </div>
      <input
        ref="validEl"
        class="grow appearance-none border-none bg-transparent focus:outline-none focus:ring-0 focus:border-transparent px-0 py-2 leading-[1]"
        :style="{ fontSize: 'inherit' }"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        spellcheck="false"
        :data-is-valid="isValid"
        @input="handleEmit($event.target)"
      >
      <div v-if="afterInput" class="opacity-50 py-2">
        {{ afterInput }}
      </div>
      <div class="text-lg" :class="[icon.color, icon.icon]" />
    </div>
    <div v-if="reasonText || reason" class="mt-2 text-[10px] font-sans text-theme-400">
      {{ reasonText || reason }}
    </div>
  </div>
</template>
