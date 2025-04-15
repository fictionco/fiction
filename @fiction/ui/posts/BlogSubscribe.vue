<script lang="ts" setup>
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

defineOptions({ name: 'BlogSubscribe' })

const props = defineProps<{
  title?: string
  subtitle?: string
  buttonText?: string
}>()

const email = vue.ref('')
const isSubmitting = vue.ref(false)
const isSuccess = vue.ref(false)
const error = vue.ref('')

const defaultTitle = 'Stay Updated'
const defaultSubtitle = 'Get the latest posts delivered to your inbox'
const defaultButtonText = 'Subscribe'

async function handleSubmit() {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    // In a real implementation, would call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 800))
    isSuccess.value = true
    email.value = ''
  } catch (err) {
    error.value = 'Failed to subscribe. Please try again.'
    console.error('Subscription error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="blog-subscribe bg-theme-100/50 dark:bg-theme-800/50 rounded-lg p-6 border border-theme-200 dark:border-theme-700">
    <div class="space-y-4">
      <h3 class="x-font-title font-semibold text-xl text-theme-900 dark:text-theme-100">
        {{ title || defaultTitle }}
      </h3>
      <p class="text-theme-700 dark:text-theme-300 text-sm" v-if="subtitle || defaultSubtitle">
        {{ subtitle || defaultSubtitle }}
      </p>

      <!-- Success message -->
      <div v-if="isSuccess" class="py-2 text-emerald-600 dark:text-emerald-400 text-sm">
        Thanks for subscribing!
      </div>

      <!-- Subscribe form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-3">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Your email address"
            class="w-full px-4 py-2 text-sm bg-white dark:bg-theme-900 border border-theme-300 dark:border-theme-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            :class="{'border-red-500 dark:border-red-400': error}"
            required
          >
          <p v-if="error" class="mt-1 text-red-600 dark:text-red-400 text-xs">{{ error }}</p>
        </div>

        <XButton
          type="submit"
          theme="primary"
          size="sm"
          class="w-full"
          :loading="isSubmitting"
        >
          {{ buttonText || defaultButtonText }}
        </XButton>
      </form>

      <p class="text-xs text-theme-500 dark:text-theme-400">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  </div>
</template>
