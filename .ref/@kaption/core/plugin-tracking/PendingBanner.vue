<script lang="ts" setup>
import { vue, vueRouter } from '@factor/api'
import { useKaption } from '../utils'
import ElButton from '../ui/ElButton.vue'

const { factorRouter, factorAdmin, factorUser } = useKaption()
const router = vueRouter.useRouter()

const links = vue.ref({
  tracking: '',
  support: factorRouter.link('support').value,
  docs: factorRouter.link('docs').value,
})
</script>

<template>
  <div class="rounded-lg border border-slate-300 bg-theme-50">
    <div class="p-3 sm:px-6 lg:px-8">
      <div class="flex w-full items-center justify-between">
        <div class="flex flex-1 items-center">
          <div>
            <div
              class="text-theme-500 relative mx-auto flex h-7 w-7 items-center justify-center rounded-full"
            >
              <div
                class="absolute h-full w-full animate-ping rounded-full border-2 border-slate-500 duration-1000"
              />
              <div class="i-carbon-flash text-2xl" />
            </div>
          </div>
          <div class="ml-5 truncate">
            <div class="font-medium leading-6">
              Waiting for Data
            </div>

            <p class="text-theme-500 hidden text-sm lg:block">
              We are waiting for initial data from the API or tracking code
            </p>
          </div>
        </div>
        <div
          class="order-3 hidden shrink-0 space-x-4 sm:order-2 sm:mt-0 sm:w-auto md:flex"
        >
          <ElButton
            :href="links.docs"
            target="_blank"
            btn="default"
          >
            View Docs
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>
