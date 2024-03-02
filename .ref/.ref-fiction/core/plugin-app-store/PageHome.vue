<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import { useFictionApp } from '../util'
import AdminPage from '../plugin-admin/AdminPage.vue'
import ElPageBanners from './ElPageBanners.vue'
import AppBanner from './AppBanner.vue'

const { fictionAppStore } = useFictionApp()
</script>

<template>
  <AdminPage title="AI Applications" format="full">
    <div class="image-container relative space-y-6">
      <div class="p-3 md:p-6">
        <div class="flow-root">
          <div
            class="text-theme-300 mx-auto w-full max-w-[1200px] pb-2 text-base font-extrabold tracking-tight"
          >
            AI Applications
          </div>
          <div role="list" class="space-y-6 pb-24">
            <ElPageBanners />
            <ElPanel
              v-for="(app, i) in fictionAppStore.apps"
              :key="i"
              class="w-full"
              box-class="p-0"
            >
              <AppBanner :app="app" />
            </ElPanel>
          </div>
        </div>
      </div>
    </div>
  </AdminPage>
</template>
