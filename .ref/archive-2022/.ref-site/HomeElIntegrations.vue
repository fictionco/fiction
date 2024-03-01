<script lang="ts" setup>
import { ref } from 'vue'
import Logos from '@kaption/ui/ElLogo.vue'

defineProps({
  title: {
    type: String,
    default: '',
    // default: "Integrates with your favorite payment providers and platforms",
  },
})
const integrations = ref([
  {
    logo: 'hubspot',
  },
  {
    logo: 'shopify',
  },
  {
    logo: 'squarespace',
  },
  {
    logo: 'adobe',
  },
  {
    logo: 'instapage',
  },
  {
    logo: 'wordpress',
  },
])
</script>

<template>
  <section class="max-w-sm">
    <h5 class="mb-10 text-center text-sm text-slate-600">
      {{ title }}
    </h5>
    <div class="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
      <div
        v-for="(integration, i) in integrations"
        :key="i"
        class="flex items-center justify-center"
      >
        <Logos :logo="integration.logo" class="h-8 max-w-full text-slate-500" />
      </div>
    </div>
  </section>
</template>
