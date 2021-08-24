<template>
  <form
    ref="form"
    class="wrap-form"
    autocomplete="on"
    @submit.prevent="submitForm()"
  >
    <div v-if="notify" class="rounded-md bg-yellow-50 p-4 my-4">
      <div class="flex">
        <div class="flex-shrink-0">
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
          <h3 class="text-sm font-medium text-yellow-800">
            {{ notify }}
          </h3>
        </div>
      </div>
    </div>
    <slot />
    <input ref="submit" class="submit hidden" type="submit" value="" />
  </form>
</template>
<script lang="ts">
import { onEvent } from "@factor/api"
import { onMounted, ref, watch } from "vue"
export default {
  props: {
    save: { type: Boolean, default: false },
    valid: { type: Boolean, default: false },
    data: { type: Object, default: () => {} },
    notify: { type: String, default: "" },
  },
  emits: ["submit", "update:valid"],
  setup(props, { emit }) {
    const form = ref<HTMLFormElement>()

    const submitForm = () => {
      const el = form.value

      if (el) {
        const valid = el.reportValidity()

        if (valid) emit("submit")
      }
    }

    const setValid = (): void => {
      const el = form.value
      if (el) {
        const valid = el.checkValidity()
        emit("update:valid", valid)
      }
    }

    onMounted(() => {
      setTimeout(() => {
        setValid()

        /**
         * Listen for blur events and validate
         */
        const el = form.value
        if (el) {
          const els = el.querySelectorAll(
            "input, select, checkbox, .f-input, textarea",
          )
          els.forEach((el) => el.addEventListener("blur", () => setValid()))
        }
      }, 300)
    })

    watch(
      () => props.data,
      () => {
        // delay due to any reactive changes in form that impact validity
        setTimeout(() => {
          setValid()
        }, 50)
      },
      { deep: true },
    )

    onEvent("submit", () => {
      submitForm()
    })

    return { form, submitForm }
  },
}
</script>
