<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElSpinner from '../loaders/ElSpinner.vue'

const props = defineProps({
  name: { type: String, default: '' },
  save: { type: Boolean, default: false },
  valid: { type: Boolean, default: false },
  data: { type: [Object, Array, String, Boolean, Number], default: undefined },
  notify: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'update:valid'])
const form = vue.ref<HTMLFormElement>()

function submitForm(): void {
  if (form.value && validateForm(true)) {
    emit('submit')
  }
}

function validateForm(reportValidity = false): boolean {
  if (!form.value)
    return false

  const inputs = form.value.querySelectorAll('input, select, textarea')
  let isValid = true

  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement
    const isInputValid = inputElement.checkValidity()

    inputElement.setAttribute('data-is-valid', isInputValid.toString())

    if (!isInputValid) {
      isValid = false
      if (reportValidity) {
        inputElement.reportValidity()
      }
    }
  })

  return isValid
}

function setValid(): void {
  if (!form.value)
    return
  const isValid = validateForm()
  emit('update:valid', isValid)
}

vue.onMounted(() => {
  vue.nextTick(() => {
    setValid()
    setupValidationListeners()
  })
})

function setupValidationListeners() {
  if (!form.value)
    return

  const observer = new MutationObserver(() => {
    setValid()
  })

  observer.observe(form.value, { childList: true, subtree: true })

  vue.onUnmounted(() => {
    observer.disconnect()
  })
}

vue.watch(() => props.data, () => vue.nextTick(setValid), { deep: true })
</script>

<template>
  <form
    ref="form"
    class="wrap-form"
    autocomplete="on"
    :data-is-valid="valid"
    @submit.prevent="submitForm()"
  >
    <div
      v-if="loading"
      class="flex items-center justify-center p-12 text-theme-300 dark:text-theme-600"
    >
      <ElSpinner class="h-6 w-6" />
    </div>
    <template v-else>
      <div v-if="notify" class="my-8 rounded-md bg-yellow-50 dark:bg-yellow-950 font-sans text-xs p-4">
        <div class="flex">
          <div class="shrink-0">
            <!-- Heroicon name: solid/exclamation -->
            <svg
              class="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-xs font-medium text-yellow-800 dark:text-theme-0">
              {{ notify }}
            </h3>
          </div>
        </div>
      </div>
      <slot />

      <input class="submit hidden" type="submit" value="">
    </template>
  </form>
</template>
