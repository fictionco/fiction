<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import InputDomain from '@factor/ui/InputDomain.vue'
import { ref } from 'vue'
import ElButton from '@kaption/ui/ElButton.vue'

const domain = ref('')

function sendToRegister(): void {
  if (domain.value)
    window.location.href = `https://app.kaption.co/register?domain=${domain.value}`
}
</script>

<template>
  <ElForm @submit="sendToRegister()">
    <div class="flex space-x-4">
      <InputDomain
        v-model="domain"
        class="w-full text-xl"
        autocomplete="url"
        required
      />
      <ElButton
        btn="primary"
        size="lg"
        class="flex-shrink-0"
        input="submit"
      >
        <span class="hidden lg:inline">View My Dashboard &rarr;</span>
        <span class="inline lg:hidden">Start</span>
      </ElButton>
    </div>
    <div class="text-xs mt-3 text-slate-400">
      Enter your website URL &middot; No credit card required
    </div>
  </ElForm>
</template>
