<script lang="ts" setup>
import { localRef, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import type { UserConfig } from './DashWrap.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const code = vue.ref('')

const validCode = vue.computed(() => {
  return (
    code.value.toLowerCase() === 'vip'
  )
})

const hideModal = localRef({
  key: 'hidePreLaunch',
  def: false,
  lifecycle: 'local',
})

function setCode() {
  if (validCode.value) {
    hideModal.value = true
    location.reload()
  }
}

const hasAccessCode = vue.ref(false)
</script>

<template>
  <div
    v-if="!hideModal"
    class="early-access-veil text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-800 via-black to-theme-800"
  >
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full flex-col items-center justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div class="p-8 text-white">
          <ElImage class="mx-auto h-[25px]" :media="card.userConfig.value.homeIcon" />
        </div>
        <div
          class="relative w-full overflow-hidden rounded-lg bg-white dark:bg-theme-800 border border-theme-300 dark:border-theme-600 px-8 pb-8 pt-10 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-12"
        >
          <div>
            <div class="my-3 text-left md:text-center   sm:my-5">
              <div class="mb-6 text-xs font-medium font-sans uppercase tracking-wider">
                <span
                  v-if="code"
                  :class="
                    validCode && code ? 'text-emerald-500' : 'text-rose-500'
                  "
                >The code you entered is
                  {{ validCode ? "valid" : "invalid" }}</span>
                <span v-else class="text-theme-400 dark:text-theme-500">The Personal Marketing Platform</span>
              </div>

              <h3
                id="modal-title"
                class="x-font-title text-3xl font-bold text-balance tracking-tight"
              >
                You're on the waitlist.
              </h3>
              <div class="mt-4">
                <p class="text-theme-500 dark:text-theme-300 text-sm text-balance">
                  Due to high demand, we are onboarding users in batches (to ensure exceptional results). When it's your turn, you'll receive an email with your access code.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 mb-6">
            <div v-if="!hasAccessCode" class="actions flex justify-center space-y-4 md:space-y-0 md:space-x-4 flex-col md:flex-row">
              <XButton
                type="button"
                theme="default"
                size="lg"
                rounding="full"
                @click="hasAccessCode = true"
              >
                Enter Invite Code
              </XButton>
              <XButton
                type="button"
                theme="primary"
                size="lg"
                href="mailto:andrew@fiction.com"
                target="_blank"
                icon="i-tabler-mail"
                rounding="full"
              >
                Email Us
              </XButton>
            </div>
            <div v-else>
              <div class="space-x-4 flex justify-center">
                <InputText v-model="code" input-class="dark:bg-theme-700" placeholder="ACCESS_CODE" @keyup.enter.stop="setCode()" />
                <XButton
                  type="button"
                  theme="primary"
                  size="lg"
                  class="shrink-0"
                  rounding="full"
                  @click="setCode()"
                >
                  Get Access
                </XButton>
              </div>
              <div class=" text-xs font-sans text-theme-500 mt-3 text-center opacity-60 uppercase tracking-wide cursor-pointer" @click="hasAccessCode = false">
                &larr; Back
              </div>
            </div>
          </div>
        </div>
        <div class="p-8 text-xs font-sans antialiased font-medium">
          <a class="text-theme-300 dark:text-theme-300  hover:opacity-80" href="https://www.fiction.com?_reload=1">Back to homepage &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.early-access-veil {
  z-index: 10000;
}
</style>
