<script setup lang="ts">
import { unhead, useService, vue } from '@factor/api'
import { getThemeFontConfig } from '@factor/api/utils/fonts'
import type { FactorAdmin } from '..'
import APage from './APage.vue'

const { factorAdmin, factorUser } = useService<{ factorAdmin: FactorAdmin }>()

unhead.useHead({ title: 'Dashboard', meta: [{ name: `description`, content: `` }] })

const loading = vue.ref(true)
vue.onMounted(async () => {
  await factorUser.userInitialized()
  loading.value = false
})

const fonts = vue.computed(() => getThemeFontConfig({
  mono: { fontKey: 'DM Mono', stack: 'monospace' },
  input: { fontKey: 'DM Mono', stack: 'sans' },
  title: { fontKey: 'Poppins', stack: 'sans' },
  sans: { stack: 'sans' },
  body: { stack: 'serif' },
  serif: { stack: 'serif' },
}))
</script>

<template>
  <APage :loading="loading" class="x-admin">
    <component :is="factorAdmin.currentView.value?.el" />
  </APage>
</template>

<style lang="less">
.x-admin{
  --font-family-mono: v-bind(fonts?.mono);
  --font-family-input: v-bind(fonts?.input);
  --font-family-sans: v-bind(fonts?.sans);
  --font-family-serif: v-bind(fonts?.serif);
  --font-family-title: v-bind(fonts?.title);
  --font-family-body: v-bind(fonts?.body);
  .x-font-title {
    font-family: var(--font-family-title);
  }
  .x-font-body {
    font-family: var(--font-family-body);
  }
  .x-font-input {
    font-family: var(--font-family-input);
  }
  .x-font-mono {
    font-family: var(--font-family-mono);
  }
  .x-font-sans {
    font-family: var(--font-family-sans);
  }

}
</style>
