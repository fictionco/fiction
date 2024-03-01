<script lang="ts" setup>
import InputEmail from '@factor/ui/InputEmail.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { vue, waitFor } from '@factor/api'

const sent = vue.ref(false)
const sending = vue.ref(false)
const email = vue.ref('')

async function sendEmail() {
  if (!email.value)
    return

  sending.value = true
  await waitFor(1000)
  sent.value = true
  sending.value = false
}
</script>

<template>
  <div class="pl-content-width mx-auto">
    <div class="px-4 text-left md:text-center lg:px-8">
      <div class="mx-auto max-w-2xl">
        <div
          class="x-font-title mb-2 text-sm font-semibold uppercase tracking-wide sm:block"
        >
          Latest Updates and Articles
        </div>
        <h2
          class="x-font-title inline text-3xl font-bold uppercase tracking-tight sm:block lg:text-6xl"
        >
          <span class="font-serif lowercase italic">the</span> Mailing List
        </h2>
      </div>

      <div
        v-if="sending"
        class="text-theme-300 flex items-center justify-center p-8"
      >
        <ElSpinner class="h-6 w-6" />
      </div>
      <form
        v-else-if="!sent"
        class="mx-auto mt-10 max-w-md"
        @submit="sendEmail()"
      >
        <div class="flex gap-x-4">
          <label for="email-address" class="sr-only">Email address</label>

          <InputEmail
            v-model="email"
            placeholder="Enter Your Email"
          />
          <ElButton @click.stop="sendEmail()">
            Subscribe
          </ElButton>
        </div>
        <p class="font-sans mt-4 text-xs leading-6">
          We care about your data. Read our
          <a
            href="/privacy"
            class="text-primary-600 hover:text-primary-500 font-semibold"
          >privacy&nbsp;policy</a>.
        </p>
      </form>
      <div v-else class="p-4 italic">
        Congrats! You've been added to the mailing list.
      </div>
    </div>
  </div>
</template>
