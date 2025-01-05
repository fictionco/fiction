<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElStart from './ElStart.vue'

const { card } = defineProps<{ card: Card }>()

const loading = vue.ref(true)

const { fictionBrand, fictionEnv } = useService<{ fictionBrand: FictionBrand }>()

const brandIndex = vue.shallowRef<TableBrand[]>([])

async function load() {
  loading.value = true

  try {
    const response = await fictionBrand.requests.ManageBrandGuide.projectRequest({ _action: 'list' })

    if (response.status === 'success' && response.data) {
      brandIndex.value = response.data
    }
    else {
      fictionEnv.events.emit('notify', { type: 'error', message: 'Failed to load brand index' })
    }
  }
  catch (error) {
    console.error('Error loading', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())

const list = vue.computed<NavListItem[]>(() => {
  if (!brandIndex.value || !Array.isArray(brandIndex.value))
    return []

  return brandIndex.value.map((brand) => {
    return {
      key: brand.brandId,
      label: brand.title || 'Untitled',
      description: brand.description || 'No description',
      href: card.link(`/brand?brandId=${brand.brandId}`),
      icon: 'i-tabler-briefcase',
    } as NavListItem
  })
})

const showStartModal = vue.ref(false)
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-6">
      <ElIndexGrid
        media-icon="i-tabler-mail"
        list-title="Brand Guide"
        :list
        :loading
        :action="{
          buttons: [{
            testId: 'new-brand-button',
            label: 'Create Brand Guide',
            icon: 'i-tabler-plus',
            theme: 'primary',
            onClick: () => { showStartModal = true },
          }] }"
      >
        <template #zero>
          <ElZeroBanner
            test-id="brand-zero"
            title="Create Your Brand Guide"
            description="Define your brand's voice, style, and content rules to power AI-assisted content creation."
            icon="i-tabler-briefcase"
            :action="{
              buttons: [{
                testId: 'new-brand-button-zero',
                label: 'Get Started',
                onClick: () => { showStartModal = true },
                theme: 'primary',
                icon: 'i-tabler-wand',
              }] }"
          />
        </template>
      </ElIndexGrid>
    </div>
    <ElStart v-model:vis="showStartModal" :card />
  </SettingsPanel>
</template>
