<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { FactorContact, TableSubmissionConfig } from '@factor/plugin-contact'
import { useService, vue } from '@factor/api'
import PageWrap from './PageWrap.vue'

const { factorContact } = useService<{ factorContact: FactorContact }>()

const form = vue.ref<Partial<TableSubmissionConfig>>({})
const sending = vue.ref(false)
const sent = vue.ref(false)
async function submit() {
  sending.value = true
  const r = await factorContact.submitForm({ submission: form.value })

  if (r.status === 'success')
    sent.value = true

  sending.value = false
}
</script>

<template>
  <PageWrap>
    <div class="text-theme-0 relative z-10 mb-24 overflow-hidden">
      <div
        class="relative z-20 mx-auto mt-8 max-w-screen-xl px-4 pt-8 sm:px-6 lg:px-8"
      >
        <div class="relative mx-auto max-w-screen-xl text-center">
          <div class="relative z-10 mx-auto max-w-xl">
            <div class="sup mb-4 text-sm font-bold uppercase tracking-widest">
              Contact Us
            </div>
            <h1
              class="font-cal mt-2 max-w-2xl text-3xl font-extrabold sm:text-4xl lg:text-4xl"
            >
              We help companies join the AI revolution... How can we help you?
            </h1>
            <div class="mt-3 text-xl sm:mt-5">
              <div class="font-semibold">
                We'd love to hear about your business and find a time to discuss
                your needs. Please fill out the form and we will be in touch
                shortly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="from-theme-50 to-theme-100 bg-gradient-to-b">
      <div
        class="bg-theme-0 text-theme-800 relative z-20 mx-auto -mb-12 max-w-xl rounded-lg p-12"
      >
        <ElForm class="space-y-6" @submit="submit()">
          <div class="text-sm font-bold uppercase tracking-wide">
            Details
          </div>
          <ElInput
            v-model="form.name"
            label="Name"
            required
            input="InputText"
            placeholder="Full Name"
            autocomplete="name"
          />
          <ElInput
            v-model="form.email"
            label="Work Email"
            required
            input="InputEmail"
            placeholder="name@example.com"
          />

          <ElInput
            v-model="form.phone"
            label="Phone (Optional)"
            input="InputPhone"
            placeholder="888-888-8888"
            autocomplete="tel"
          />
          <ElInput
            v-model="form.orgName"
            label="Organization Name"
            input="InputText"
            placeholder="Organization"
            autocomplete="org"
          />
          <ElInput
            v-model="form.orgTitle"
            label="Title / Job"
            input="InputText"
            placeholder="Title"
            autocomplete="org-title"
          />
          <ElInput
            v-model="form.orgUrl"
            label="Organization Website"
            input="InputUrl"
            placeholder="https://www.example.com"
            autocomplete="org-url"
          />
          <ElInput
            v-model="form.message"
            label="Message"
            input="InputTextarea"
            required
            placeholder="Provide as much info as possible about your situation and goals."
            :rows="10"
          />
          <ElButton
            type="submit"
            btn="primary"
            :loading="sending"
          >
            Send
          </ElButton>
        </ElForm>
        <div
          v-if="sent"
          class="bg-theme-0 absolute inset-0 z-10 p-16 text-center"
        >
          <div>
            <div class="font-cal text-3xl">
              Form Submitted
            </div>
            <div class="my-8 text-xl">
              Thanks for getting in touch! We'll get back to you as soon as
              possible.
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrap>
</template>
