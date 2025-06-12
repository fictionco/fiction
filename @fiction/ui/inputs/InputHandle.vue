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
const status = vue.ref<ResponseStatus>('unknown')
const reason = vue.ref<ValidationReason>('unknown')
const isValid = vue.ref(false)
const inputRef = vue.ref<HTMLInputElement>()

const reasonText = vue.computed(() => {
  const messages = {
    short: `At least ${props.minLength} characters required`,
    long: `Maximum ${props.maxLength} characters allowed`,
    invalid: 'Only lowercase letters, numbers, and hyphens allowed',
    success: 'Available!',
    current: 'This is your current handle',
    error: 'Unable to check availability. Please try again.',
    loading: 'Checking availability...',
    taken: 'This handle is already in use',
    reserved: 'This handle is not available',
    required: 'Handle is required',
    unknown: '',
  } as const

  return messages[reason.value as keyof typeof messages]
})

const icon = vue.computed(() => {
  const icons = {
    success: { icon: 'i-tabler-check', color: 'text-green-500' },
    error: { icon: 'i-tabler-exclamation-circle', color: 'text-red-500' },
    loading: { icon: 'i-tabler-reload animate-spin', color: 'text-theme-400' },
    fail: { icon: 'i-tabler-x', color: 'text-red-500' },
    unknown: { icon: 'i-tabler-line-dashed', color: 'text-theme-400' },
  }

  return icons[status.value]
})

async function validateHandle(value: string) {
  if (!value) {
    status.value = 'unknown'
    reason.value = 'unknown'
    inputRef.value?.setCustomValidity('')
    return
  }

  if (value === initialValue.value) {
    status.value = 'success'
    reason.value = 'current'
    inputRef.value?.setCustomValidity('')
    return
  }

  if (value.length < props.minLength) {
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
  else if (props.table) {
    status.value = 'loading'
    reason.value = 'loading'

    try {
      const columns = props.columns.map(c => ({ ...c, value: c.value || value }))
      const response = await fictionDb.requests.CheckHandle.request({
        table: props.table,
        columns,
      })

      status.value = response.data?.available || 'error'
      reason.value = response.data?.reason ?? 'unknown'
    }
    catch {
      status.value = 'error'
      reason.value = 'error'
    }
  }
  else {
    status.value = 'success'
    reason.value = 'success'
  }

  // Only set as valid if status is success
  isValid.value = status.value === 'success'
  inputRef.value?.setCustomValidity(isValid.value ? '' : reasonText.value)
}

async function handleInput(event: Event) {
  const rawValue = (event.target as HTMLInputElement).value
  emit('update:modelValue', rawValue)
  await validateHandle(rawValue)
}

function focusInput() {
  inputRef.value?.focus()
}

// Validate on mount if there's an initial value
vue.onMounted(() => {
  if (props.modelValue) {
    validateHandle(props.modelValue)
  }
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
        class="grow px-0 min-w-0 w-full lowercase"
        :class="[cls.padY, cls.reset]"
        :style="{ fontSize: 'inherit' }"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        spellcheck="false"
        :required="required"
        :data-is-valid="isValid"
        @input="handleInput"
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
