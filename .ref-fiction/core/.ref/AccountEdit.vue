<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { FactorRouter, FactorUser, User } from '@factor/api'
import { useService, vue } from '@factor/api'

import AccountWrap from '../AccountWrap.vue'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const formError = vue.ref('')
const user = vue.computed<Partial<User>>(
  () => factorUser.activeUser.value || {},
)
const form = vue.ref<Partial<User>>(user.value)

const sending = vue.ref(false)
const sent = vue.ref(false)

async function updateUser(): Promise<void> {
  const fields = { ...form.value }
  const r = await factorUser.requests.ManageUser.projectRequest({
    _action: 'update',
    fields,
  })

  if (r.status !== 'success')
    formError.value = r.message ?? ''
}

async function send(): Promise<void> {
  sending.value = true
  await updateUser()
  sending.value = false
  sent.value = true
}

vue.watch(
  () => factorUser.activeUser.value,
  (v) => {
    if (v)
      form.value = v
  },
)
</script>

<template>
  <AccountWrap>
    <div class="max-w-lg space-y-6">
      <ElInput
        v-model="form.fullName"
        input="InputText"
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <ElInput
        v-model="form.username"
        input="InputText"
        label="Username"
        sub-label="Must be unique. Used in profile URL."
        placeholder="johnny"
        required
      />

      <ElInput
        v-model="form.email"
        input="InputEmail"
        label="Email Address"
        placeholder="email@example.com"
        disabled
      >
        <template #after>
          <div class="mt-4">
            <ElButton
              btn="default"
              :to="
                factorRouter.link('accountChangeEmail', {
                  mode: 'email',
                }).value
              "
            >
              Change Email &rarr;
            </ElButton>
          </div>
        </template>
      </ElInput>
      <ElInput
        v-model="form.phoneNumber"
        input="InputPhone"
        label="Phone Number"
        sub-label="Used for SMS notifications"
        placeholder="+1 555 555 5555"
      />
      <div>
        <ElButton
          btn="primary"
          :loading="sending"
          @click="send()"
        >
          Save Changes
        </ElButton>
      </div>
    </div>
    <!-- <div class="flow-root py-8 px-4 lg:px-6">
        <ul class="-mb-8">
          <li>
            <div class="relative pb-8">
              <span
                class="absolute top-5 left-3 -ml-px h-full w-0.5 bg-theme-200"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-theme-500 ring-8 ring-white"
                  >
                    <svg
                      class="h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div class="flex min-w-0 flex-1 justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      Your User ID
                      <span class="font-medium text-gray-900">
                        {{ user.userId }}
                      </span>
                    </p>
                  </div>
                  <div
                    class="whitespace-nowrap text-right text-sm text-theme-500"
                  >
                    Auth
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="relative pb-8">
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white ring-8 ring-white"
                  >
                    <svg
                      class="h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div class="flex min-w-0 flex-1 justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      Account Created on
                      <a href="#" class="font-medium text-gray-900">{{
                        standardDate(user.createdAt)
                      }}</a>
                    </p>
                  </div>
                  <div
                    class="whitespace-nowrap text-right text-sm text-theme-500"
                  >
                    {{ timeAgo(user.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div> -->
  </AccountWrap>
</template>
