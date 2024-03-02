<script lang="ts" setup>
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import { useMeta, vue } from '@factor/api'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { getDashboardUrl } from '@fiction/core/util'
import PageWrap from '../el/PageWrap2.vue'

const form = vue.ref<Partial<any>>({})
const sending = vue.ref(false)
// const sent = vue.ref(false)
async function submit() {
  sending.value = true
  // const r = await factorContact.submitForm({ submission: form.value })

  // if (r.status === "success") {
  //   sent.value = true
  // }

  sending.value = false
}

const metaTitle = 'Join Fiction'

const metaDescription
  = 'Fiction is a company creating AI tools for designers and creatives.'

useMeta({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})
</script>

<template>
  <PageWrap class="">
    <div class="relative overflow-visible px-4 py-24">
      <div class="text-center">
        <h1
          class="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-6 lg:text-5xl xl:text-6xl"
        >
          Join Fiction
        </h1>
        <p class="text-theme-500 mb-12 text-2xl lg:mb-20 lg:text-3xl">
          Connect with 5000+ members in the Fiction community
        </p>
      </div>
      <ContentBox wrap-class="z-20 p-8 md:p-16" width-class="max-w-prose">
        <div class="relative">
          <div class="mx-auto max-w-lg">
            <p class="mb-3 text-2xl font-extrabold tracking-tight md:text-3xl">
              Fiction is currently invite-only
            </p>
            <div class="text-theme-600 my-6 space-y-5 text-lg md:text-2xl">
              <p>
                Ask an existing member to invite you, or apply for an invite by
                filling out the form linked below.
              </p>
              <p>
                Members periodically review these applications and accept those
                who seem like a good fit.
              </p>
              <p class="">
                Already have an invite code?
                <a
                  :href="getDashboardUrl({ path: '/register' })"
                  class="text-primary-500"
                >Register here.</a>
              </p>
            </div>

            <ElForm
              class="border-theme-200 mt-8 space-y-6 border-t pt-8"
              @submit="submit()"
            >
              <div class="text-lg font-bold">
                Apply to Fiction
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
                label="Email"
                required
                input="InputEmail"
                placeholder="name@example.com"
              />
              <ElInput
                v-model="form.email"
                label="Twitter or LinkedIn"
                required
                input="InputEmail"
                placeholder="https://www.twitter.com/example"
              />
              <ElInput
                v-model="form.organizationUrl"
                label="Website"
                input="InputUrl"
                placeholder="https://www.example.com"
                autocomplete="organization-url"
              />
              <ElInput
                v-model="form.organizationName"
                label="About You"
                sub-label="Please include any links, current goals, and challenges."
                input="InputTextarea"
                placeholder="I work at [company] as a [role], etc.."
                autocomplete="organization"
                :rows="7"
              />

              <ElInput
                v-model="form.message"
                label="What do you hope Fiction will provide?"
                input="InputTextarea"
                required
                placeholder="Provide as much info as possible about your situation and goals."
                :rows="3"
              />
              <ElButton
                type="submit"
                btn="primary"
                :loading="sending"
              >
                Send
              </ElButton>
            </ElForm>
          </div>
        </div>
      </ContentBox>
    </div>
  </PageWrap>
</template>
