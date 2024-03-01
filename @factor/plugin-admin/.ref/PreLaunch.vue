<script lang="ts" setup>
import { vue } from '@factor/api'
import InputText from '@factor/ui/InputText.vue'
import FictionLogo from '../../ui/FictionLogo.vue'

const code = vue.ref('')

const validCode = vue.computed(() => {
  return (
    code.value.toLowerCase() === 'ai' || code.value.toLowerCase() === 'fiction'
  )
})

function setCode() {
  if (validCode.value) {
    localStorage.setItem('FICTION_ACCESS', 'yes')
    location.reload()
  }
}
</script>

<template>
  <div
    class="early-access-veil text-primary-500 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900"
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
          <FictionLogo class="mx-auto w-24" />
        </div>
        <div
          class="relative w-full overflow-hidden rounded-lg bg-white px-8 pb-8 pt-10 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6"
        >
          <div>
            <div class="mt-3 text-center text-slate-800 sm:mt-5">
              <div class="mb-4 text-xs font-bold uppercase tracking-widest">
                <span
                  v-if="code"
                  :class="
                    validCode && code ? 'text-emerald-500' : 'text-rose-500'
                  "
                >The code you entered is
                  {{ validCode ? "valid" : "invalid" }}</span>
                <span v-else class="text-theme-500">Thanks for signing up</span>
              </div>

              <h3
                id="modal-title"
                class="text-2xl font-extrabold leading-6 tracking-tight"
              >
                Fiction Launches March 15
              </h3>
              <div class="mt-2">
                <p class="text-theme-500 text-sm font-medium">
                  We're currently in pre-launch mode. If you have early access,
                  please enter your access code below.
                  <a href="mailto:andrew@fiction.com" class="text-primary-500">Email us &rarr;</a>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 space-y-6 sm:mt-6">
            <InputText v-model="code" placeholder="ACCESS_CODE" />
            <button
              type="button"
              class="bg-primary-800 hover:bg-primary-700 focus:ring-primary-500 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
              @click="setCode()"
            >
              Get Early Access
            </button>
          </div>
        </div>
        <div class="text-theme-700 p-8 text-xs font-semibold uppercase">
          <a href="https://www.fiction.com">back to fiction.com</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.early-access-veil {
  z-index: 10000;
  --input-bg: theme("colors.theme.50");
  --input-y: 0.5rem;
  --input-x: 0.75rem;
  --input-size: 1rem;
}
</style>
