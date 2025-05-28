<script lang="ts" setup>
import type { ColorThemeUser, StandardSize } from '@fiction/core'
import { gravatarUrlSync, isValidEmail, useService, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectDraggableSort from '@fiction/ui/effect/EffectDraggableSort.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { textInputClasses } from './theme'

defineOptions({ name: 'InputEmailMulti' })

const props = defineProps<{
  modelValue?: string[]
  uiSize?: StandardSize
  placeholder?: string
  label?: string
  table?: string
  column?: string
  maxItems?: number
  inputClass?: string
  theme?: ColorThemeUser
  showMailProvider?: boolean
  disabled?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const service = useService()

const inputText = vue.ref('')
const isFocused = vue.ref(false)
const isInvalid = vue.ref(false)
const invalidMessage = vue.ref('')
const theInput = vue.ref<HTMLInputElement>()

// Size configuration
const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { wrap: 'gap-0.5 py-0.5', avatar: 'size-3', buttonContent: 'text-xs gap-0.5', button: 'xxs' },
    'xs': { wrap: 'gap-1 py-1', avatar: 'size-4', buttonContent: 'text-xs gap-0.5', button: 'xxs' },
    'sm': { wrap: 'gap-1.5 py-1', avatar: 'size-4', buttonContent: 'text-sm gap-0.5', button: 'xs' },
    'md': { wrap: 'gap-2 py-2', avatar: 'size-5', buttonContent: 'text-sm gap-1', button: 'sm' },
    'lg': { wrap: 'gap-3 py-2', avatar: 'size-6', buttonContent: 'text-base gap-1', button: 'sm' },
    'xl': { wrap: 'gap-4 py-3', avatar: 'size-7', buttonContent: 'text-lg gap-1.5', button: 'md' },
    '2xl': { wrap: 'gap-5 py-4', avatar: 'size-8', buttonContent: 'text-xl  gap-1.5', button: 'lg' },
  }

  return sizes[props.uiSize as keyof typeof sizes] || sizes.md
})

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''

  // Process multiple emails from clipboard
  const potentialEmails = pastedText.split(/[,;\n]/)
  const validEmails: string[] = []
  let invalidCount = 0

  potentialEmails.forEach((email) => {
    const trimmed = email.trim()
    if (trimmed && isValidEmail(trimmed)) {
      if (props.modelValue?.includes(trimmed)) {
        // Duplicate email
        invalidCount++
      }
      else if (props.maxItems && (props.modelValue?.length || 0) + validEmails.length >= props.maxItems) {
        // Max limit reached
        if (invalidCount === 0) {
          showMessage('error', `Maximum of ${props.maxItems} emails allowed`)
          invalidCount++
        }
      }
      else {
        // Valid email - collect for bulk addition
        validEmails.push(trimmed)
      }
    }
    else if (trimmed) {
      // Invalid email format
      invalidCount++
    }
  })

  // Add all valid emails at once
  if (validEmails.length > 0) {
    emit('update:modelValue', [...(props.modelValue || []), ...validEmails])
    showMessage('success', `Added ${validEmails.length} email${validEmails.length > 1 ? 's' : ''}`)
  }

  // Show error message for invalid emails if needed
  if (invalidCount > 0 && validEmails.length === 0) {
    showMessage('error', `No valid emails found in pasted content`)
  }
}

function showMessage(type: 'error' | 'success', message: string) {
  service.fictionEnv.events.emit('notify', { message, type })
}

function addItem(value: string, opts?: { noError?: boolean }) {
  const { noError } = opts || {}
  if (!value)
    return

  inputText.value = ''

  const newItems = value.split(',')
    .map(t => t.toLowerCase().trim())
    .filter((t) => {
      let msg = ''
      if (!isValidEmail(t)) {
        msg = `"${t}" is not a valid email`
      }
      if (props.modelValue?.includes(t)) {
        msg = `"${t}" is already added`
      }
      if (props.maxItems && (props.modelValue?.length || 0) >= props.maxItems) {
        msg = `Maximum of ${props.maxItems} emails allowed`
      }
      if (!noError && msg) {
        showMessage('error', msg)
      }

      return !msg
    })

  if (newItems.length) {
    emit('update:modelValue', [...(props.modelValue || []), ...newItems])
  }
}

function removeItem(value: string) {
  emit('update:modelValue', (props.modelValue || []).filter(t => t !== value))
}

function handleKeydown(event: KeyboardEvent) {
  if (!isFocused.value)
    return

  if (['Tab', 'Enter', ',', ';'].includes(event.key)) {
    event.preventDefault()
    if (inputText.value) {
      addItem(inputText.value)
    }
  }
  else if (event.key === 'Backspace' && !inputText.value && props.modelValue?.length) {
    removeItem(props.modelValue[props.modelValue.length - 1])
  }
}

// Sort handler
async function handleSort(sorted: string[]) {
  await waitFor(20)
  emit('update:modelValue', sorted.filter(v => props.modelValue?.includes(v)))
}

function getEmailParts(email: string) {
  const parts = email.split('@')
  return { name: parts[0], domain: parts[1] || '' }
}

const containerClasses = vue.computed(() => {
  return [
    textInputClasses({
      uiSize: props.uiSize,
      inputClass: `flex flex-wrap items-center ${sizeClasses.value.wrap} !bg-transparent`,
    }),
    isInvalid.value ? 'border-red-500 dark:border-red-400' : '',
  ]
})
const attrs = vue.useAttrs()
const validEl = vue.ref<HTMLInputElement>()
vue.watch(
  () => props.modelValue,
  (val) => {
    const min = attrs.required === undefined ? 0 : 1

    if ((min && !val) || (val && val.length < min))
      validEl.value?.setCustomValidity(`Please add at least ${min} email`)
    else
      validEl.value?.setCustomValidity('')
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative">
    <div
      class=""
      @click.self="!disabled && theInput?.focus()"
    >
      <EffectDraggableSort
        class="inline-flex flex-wrap items-center w-full max-h-[50vh] overflow-y-auto"
        :class="containerClasses"
        :allow-horizontal="true"
        :disabled="disabled"
        @update:sorted="handleSort"
      >
        <template v-if="modelValue?.length">
          <XButton
            v-for="email in modelValue"
            :key="email"
            :data-drag-id="email"
            :size="(sizeClasses.button as StandardSize)"
            :theme="theme || 'default'"
            rounding="full"
            design="outline"
            :disabled="disabled"
            class="group"
            hover="none"
            :classes="{ button: 'cursor-grab' }"
            @click.stop
          >
            <span class="flex items-center " :class="sizeClasses.buttonContent">
              <XMedia
                :media="gravatarUrlSync(email, { size: 24 })"
                class="border dark:border-theme-700 rounded-full overflow-hidden flex-shrink-0"
                :class="[sizeClasses.avatar]"
              />
              <span>
                {{ email }}
              </span>
              <span
                v-if="!disabled"
                class="i-tabler-x opacity-50 group-hover:opacity-100 cursor-pointer"
                @click.stop="removeItem(email)"
              />
            </span>
          </XButton>
        </template>

        <input
          ref="theInput"
          v-model="inputText"
          data-test-id="email-input"
          type="text"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          :disabled
          :required="required && !modelValue?.length"
          :placeholder="modelValue?.length ? '' : (placeholder || `Add ${label || 'emails'}...`)"
          class="flex-1 min-w-[8rem] p-1 font-mono bg-transparent border-0 focus:ring-0 focus:outline-none"
          :class="[
            sizeClasses.buttonContent,
          ]"
          @keydown="handleKeydown"
          @focus="isFocused = true"
          @blur="() => { isFocused = false; inputText && addItem(inputText, { noError: true }) }"
          @paste="handlePaste"
        >
      </EffectDraggableSort>
    </div>
    <!-- For validation -->
    <input
      ref="validEl"
      class="max-w-input pointer-events-none float-left h-0 w-full p-0 opacity-0"
      type="text"
      :value="modelValue"
    >
  </div>
</template>
