<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { replaceAll, useService, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import ElServerManager from '../plugin-instance/ElServerManager.vue'
import type { FictionInstance } from '../plugin-instance'

const { fictionInstance } = useService<{
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
}>()
const url = vue.computed(() => {
  const state = fictionInstance.instanceState.value

  if (state.status !== 'running' || !state.publicIp)
    return ''

  const publicIp = state.publicIp || ''

  const ipSlug = replaceAll(publicIp, '.', '-')

  return `https://${ipSlug}_4040.ui.fiction.com`
})

const vis = vue.ref(false)
</script>

<template>
  <AdminPage format="full">
    <div
      class="bg-theme-0 border-theme-300 text-theme-700 flex justify-between border-b p-4 font-bold"
    >
      <div class="flex space-x-4">
        <div>File Browser</div>
      </div>
      <div class="flex items-center text-xs">
        <a
          class="text-theme-400 cursor-pointer items-center space-x-2 hover:opacity-75"
          :href="url"
          target="_blank"
          @click="vis = false"
        >
          <span class="uppercase">Open in New Window</span>
        </a>
      </div>
    </div>
    <ElPanel v-if="!url" class="my-12">
      <ElServerManager
        class="h-full"
        sub-title="Active Server Required"
        title="Access Your Server Files"
        description="Activate the server to view its files here."
      />
    </ElPanel>
    <iframe
      v-else
      :src="url"
      width="100%"
      height="100%"
    />
  </AdminPage>
</template>
