<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { FactorContact, TableSubmissionConfig } from '@factor/plugin-contact'
import { useMeta, useService, vue } from '@factor/api'
import PageWrap from './SiteWrap.vue'

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
useMeta({
  title: 'Contact Form',
  meta: [
    {
      name: `description`,
      content: `Contact the PageLines Sales Team or Management.`,
    },
  ],
})
</script>

<template>
  <PageWrap>
    <div
      class="relative z-10 mx-auto max-w-screen-xl grid-cols-12 gap-12 overflow-hidden px-4 py-12 md:grid"
    >
      <div
        class="relative z-20 col-span-12 mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 md:col-span-6 lg:px-8"
      >
        <div class="relative max-w-screen-xl md:mx-auto">
          <div class="relative z-10 max-w-xl md:mx-auto">
            <h1
              class="sup text-primary-500 mb-4 text-sm font-semibold uppercase tracking-widest"
            >
              Getting in touch
            </h1>
            <div
              class="font-brand mb-6 mt-2 max-w-2xl text-3xl font-bold tracking-tight lg:text-8xl"
            >
              Contact the <span class="under">Sales Team</span>
            </div>
            <div
              class="font-brand mt-3 hidden space-y-6 text-xl sm:mt-12 md:block"
            >
              <p class="text-2xl">
                Please fill out the form and we will be in touch as soon as
                possible.
              </p>
              <p>
                Whether you're a potential user with questions about the
                product, or are already using PageLines and have questions about
                expanding your current package, we're ready to help.
              </p>
              <p>
                Fill out the form below and one of our sales expert we'll be in
                touch as soon as possible. Filling all the fields helps us
                giving you a more informed answer with less back and forth.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div
          class="bg-theme-0 text-theme-800 border-theme-300 relative z-20 rounded-lg border p-6 shadow-lg md:p-12"
        >
          <ElForm class="space-y-6" @submit="submit()">
            <div
              class="text-theme-400 text-xs font-medium uppercase tracking-widest"
            >
              Contact Form
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
              v-model="form.organizationName"
              label="Organization Name"
              input="InputText"
              placeholder="Organization"
              autocomplete="organization"
            />
            <ElInput
              v-model="form.organizationTitle"
              label="Title / Job"
              input="InputText"
              placeholder="Title"
              autocomplete="organization-title"
            />
            <ElInput
              v-model="form.organizationUrl"
              label="Organization Website"
              input="InputUrl"
              placeholder="https://www.example.com"
              autocomplete="organization-url"
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
    </div>
  </PageWrap>
</template>
