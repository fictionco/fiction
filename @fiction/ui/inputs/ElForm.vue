<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElSpinner from '../loaders/ElSpinner.vue'

defineOptions({ name: 'ElForm' })

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

let observer: MutationObserver | undefined
function setupValidationListeners() {
  if (!form.value)
    return

  observer = new MutationObserver(() => setValid())

  observer.observe(form.value, { childList: true, subtree: true })
}
vue.onUnmounted(() => observer?.disconnect())

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
      <div v-if="notify" class="p-2 bg-rose-100 dark:bg-rose-900/30 font-sans mb-4 rounded-lg  text-xs text-center text-rose-700 dark:text-rose-400">
        {{ notify }}
      </div>
      <slot />

      <input class="submit hidden" type="submit" value="">
    </template>
  </form>
</template>
