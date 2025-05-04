<script lang="ts" setup>
import type { UiElementSize } from '@fiction/ui/utils'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

export interface CustomDomain {
  hostname: string
  isPrimary: boolean
}

const props = defineProps({
  modelValue: { type: Array as vue.PropType<CustomDomain[]>, default: () => [] },
  destination: { type: String, required: true },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const copyText = vue.ref('Copy')
const copyEffect = vue.ref(false)

async function handleCopy(): Promise<void> {
  if (!navigator.clipboard)
    return
  try {
    await navigator.clipboard.writeText(props.destination)
    copyText.value = 'Copied!'
    copyEffect.value = true
    setTimeout(() => {
      copyText.value = 'Copy'
      copyEffect.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="custom-domains p-6 rounded-md bg-theme-50 dark:bg-theme-800 text-sm">
    <h3 class="text-lg font-semibold mb-4 text-theme-900 dark:text-theme-100 ">Connect Your Domain</h3>
    <ol class="list-decimal ml-4 space-y-2">
      <li>Log in to your domain provider (e.g., GoDaddy, Namecheap).</li>
      <li>Go to DNS settings (often called "DNS Management").</li>
      <li>
        Add a <strong>CNAME record</strong>:
        <div class="mt-2 grid gap-2">
          <div><strong>Host:</strong> Your subdomain (e.g., 'www')</div>
          <div>
            <strong>Target:</strong>
            <div class="flex flex-col gap-2 my-4">
              <XButton
                design="outline"
                theme="primary"
                :size="uiSize"
                aria-label="Copy target URL"
                icon="i-tabler-copy"
                @click.prevent="handleCopy()"
              >
                {{ destination }}
              </XButton>
              <div
                class="flex gap-2 items-center text-primary-500 dark:text-primary-400"
                :class="{ 'opacity-100': copyEffect, 'opacity-0': !copyEffect }"
                role="status"
              >
                <div class="i-tabler-check" />
                <span class="text-xs">{{ copyText }}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ol>
    <div class="mt-4 text-xs text-theme-500 dark:text-theme-400">
      <p class="font-semibold">Notes:</p>
      <ul class="list-disc pl-6 space-y-1">
        <li>DNS updates typically take 15-30 minutes.</li>
        <li>
          Need help? <a href="mailto:support@example.com" class="underline">Contact support</a>.
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less">
.custom-domains {
  @apply text-theme-900 dark:text-theme-100;
  .copy-feedback {
    transition: opacity 0.3s ease;
  }
}
</style>
