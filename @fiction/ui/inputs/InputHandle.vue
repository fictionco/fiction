<script lang="ts" setup>
import type { ResponseStatus, ValidationReason } from '@fiction/core'
import type { CheckColumnValue } from '@fiction/core/plugin-db/endpoint'
import type { UiElementSize } from '../utils'
import { useService, vue } from '@fiction/core'
import ElTooltip from '../common/ElTooltip.vue'
import { inputClasses } from './theme'

defineOptions({ name: 'InputHandle' })

const props = defineProps({
  modelValue: { type: [String], default: '' },
  placeholder: { type: String, default: '' },
  beforeInput: { type: String, default: '' },
  afterInput: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  table: { type: String, default: '' },
  columns: { type: Array as vue.PropType<CheckColumnValue[]>, default: () => [] },
  maxLength: { type: Number, default: 100 },
  minLength: { type: Number, default: 4 },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  required: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const { fictionDb } = useService()
const initialValue = vue.ref(props.modelValue)
const status = vue.ref<ResponseStatus>(props.modelValue ? 'success' : 'unknown')
const reason = vue.ref<ValidationReason>(props.modelValue ? 'current' : 'unknown')
const inputRef = vue.ref<HTMLInputElement>()
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
    unknown: '',
  } as const

  return r[reason.value as keyof typeof r]
})

async function handleEmit(target: EventTarget | null) {
  const el = target as HTMLInputElement
  const value = el.value

  const columns = props.columns.map(c => ({ ...c, value: !c.value ? value : c.value }))

  emit('update:modelValue', value)

  // Reset status when empty
  if (!value) {
    status.value = 'unknown'
    reason.value = 'unknown'
    isValid.value = -1
    inputRef.value?.setCustomValidity('')
    return
  }

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
  else if (/[^\w-]/.test(value)) {
    status.value = 'fail'
    reason.value = 'invalid'
  }
  else {
    status.value = 'loading'

    try {
      const r = await fictionDb.requests.CheckHandle.request({ table: props.table, columns })

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
    inputRef.value?.setCustomValidity('')
    isValid.value = 1
  }
  else {
    inputRef.value?.setCustomValidity(reasonText.value)
    isValid.value = 0
  }
}

function focusInput() {
  inputRef.value?.focus()
}

const icon = vue.computed(() => {
  const i = {
    success: { icon: 'i-tabler-check', color: 'text-green-500' },
    error: { icon: 'i-tabler-exclamation-circle', color: 'text-red-500' },
    loading: { icon: 'i-tabler-reload animate-spin', color: 'text-theme-400' },
    fail: { icon: 'i-tabler-x', color: 'text-red-500' },
    unknown: { icon: 'i-tabler-line-dashed', color: 'text-theme-400' },
  }

  return i[status.value]
})

const cls = vue.computed(() => inputClasses({ uiSize: props.uiSize }))
</script>

<template>
  <div :class="[cls.textSize]">
    <div
      class="flex items-center space-x-1 cursor-text"
      :class="[cls.base, cls.border, cls.focus, cls.padX, cls.bg]"
      tabindex="-1"
      @click="focusInput"
    >
      <div
        v-if="beforeInput"
        class="whitespace-nowrap select-none cursor-pointer text-theme-300"
      >
        {{ beforeInput }}
      </div>
      <input
        ref="inputRef"
        class="grow px-0 leading-[1] min-w-0 w-full"
        :class="[cls.padY, cls.reset]"
        :style="{ fontSize: 'inherit' }"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        spellcheck="false"
        :data-is-valid="isValid"
        :required="required ? 'true' : undefined"
        autocomplete="username"
        @input="handleEmit($event.target)"
      >
      <div
        v-if="afterInput"
        class="select-none text-theme-300"
      >
        {{ afterInput }}
      </div>
      <ElTooltip v-if="table" :content="reasonText" class="flex items-center" direction="top">
        <div class="text-[1.3em] shrink-0" :class="[icon.color, icon.icon]" />
      </ElTooltip>
    </div>
    <div v-if="table" class="mt-1.5 text-[.7em] font-sans text-theme-400" :class="reasonText ? 'opacity-100' : 'opacity-0'">
      {{ reasonText }}
    </div>
  </div>
</template>
