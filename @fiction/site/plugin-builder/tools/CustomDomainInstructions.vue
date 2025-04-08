<script lang="ts" setup>
import type { UiElementSize } from '@fiction/ui/utils'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

export interface CustomDomain {
  hostname?: string
  isPrimary?: boolean
}

const props = defineProps({
  modelValue: { type: Array as vue.PropType<CustomDomain[]>, default: () => ([]) },
  destination: { type: String, required: true },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const defaultCopyText = 'click to copy'
const copyText = vue.ref(defaultCopyText)
const copyEffect = vue.ref(false)
async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.destination)
    copyText.value = '...copied!'
    copyEffect.value = true
    setTimeout(() => {
      copyText.value = defaultCopyText
      copyEffect.value = false
    }, 2500)
  }
  catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="custom-domains text-sm p-6 rounded-md bg-theme-50 dark:bg-theme-800">
    <ol class="list-decimal list-outside ml-4 space-y-3 leading-[1.6]">
      <li>Sign in to your domain provider's website (like GoDaddy, Namecheap, or Google Domains)</li>
      <li>Find the DNS settings or DNS management section</li>
      <li>
        Add a new <strong>CNAME record</strong> with these settings:
        <div class="mt-2 space-y-2">
          <div><strong>Host/Name:</strong> Your subdomain (usually 'www')</div>
          <div class="">
            <strong>Target/Value:</strong> Copy this exactly &darr;
            <div class="flex gap-3 flex-col items-center my-6">
              <XButton
                design="outline"
                theme="primary"
                size="lg"
                title="Click to copy to clipboard"
                format="block"
                icon="i-tabler-copy"
                @click.prevent="handleCopy()"
              >
                <div class="flex justify-between items-center w-full gap-4">
                  <span>{{ destination }}</span>
                </div>
              </XButton>
              <div class="flex gap-2 items-center text-primary-500 dark:text-primary-400">
                <div class="i-tabler-arrow-up" />
                <div class="text-[10px] whitespace-nowrap" v-html="copyText" />
              </div>
            </div>
          </div>
        </div>
      </li>
    </ol>
    <div class="mt-4 space-y-2 text-[11px]">
      <p class="text-theme-500 dark:text-theme-400 font-semibold">
        Notes:
      </p>
      <ul class="list-disc list-outside pl-6 space-y-1 text-theme-500 dark:text-theme-400">
        <li>DNS changes typically take 15-30 minutes to work, but can take up to 48 hours to fully propagate across the internet.</li>
        <li> Need help? Our support team can guide you through the process or check your DNS configuration.</li>
      </ul>
    </div>
  </div>
</template>

<style lang="less">
@keyframes scaleup {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

/* Class to apply the animation */
.scale-effect {
  animation: scaleup .4s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
