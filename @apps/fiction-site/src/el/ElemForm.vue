<template>
  <form
    ref="emailForm"
    action="#"
    class="mt-12 mx-auto sm:max-w-lg sm:flex"
    method="POST"
    data-netlify="true"
    @submit.prevent="handleSubmitForm()"
  >
    <div
      id="signedUp"
      v-if="sent"
      class="
        p-3
        text-white
        border-2 border-gray-700
        rounded-md
        w-full
        text-center
      "
    >
      Email Sent!
    </div>
    <template v-else
      ><div class="min-w-0 flex-1">
        <label for="cta_email" class="sr-only">Email address</label>
        <input
          id="cta_email"
          type="email"
          class="
            block
            w-full
            border border-transparent
            rounded-md
            px-5
            py-3
            text-base text-gray-900
            placeholder-gray-500
            shadow-sm
            focus:outline-none
            focus:border-transparent
            focus:ring-2
            focus:ring-white
            focus:ring-offset-2
            focus:ring-offset-primary-600
          "
          placeholder="Enter your email"
          @keyup.enter.stop="emitEvent('submit')"
        />
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-3 flex">
        <ElemButton btn="primary" class="items-center" :loading="sending"
          >Join Invite List</ElemButton
        >
      </div>
    </template>
  </form>
</template>
<script lang="ts">
import { emitEvent } from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"
import { ref } from "vue"
export default {
  components: { ElemButton },
  setup() {
    const sent = ref(false)
    const sending = ref(false)
    const emailForm = ref<HTMLFormElement>()

    const handleSubmitForm = async (): Promise<void> => {
      const emailFormEl = emailForm.value

      if (emailFormEl) {
        sending.value = true
        let formData = new FormData(emailFormEl)
        try {
          await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData as any).toString(),
          })

          sent.value = true
          sending.value = false
        } catch {
          sending.value = false
        }
      }
    }

    return { handleSubmitForm, emailForm, emitEvent, sent, sending }
  },
}
</script>
