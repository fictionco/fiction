<script lang="ts" setup>
import type { ActionItem } from '@factor/api'
import { vue } from '@factor/api'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import { useFictionApp } from '../../util'
import { Render } from '../model'
import ElRenderIndex from '../el/ElRenderIndex.vue'

const { factorRouter, fictionModel, factorUser } = useFictionApp()

const indexState = fictionModel.activeIndexState
const loadingPage = vue.ref<boolean>(true)
const renders = vue.shallowRef<Render[]>([])
const actions: ActionItem[] = [
  {
    name: `Create Renders`,
    link: factorRouter.link('renderCreate', { modelId: '' }),
    btn: 'primary',
  },
]

vue.onMounted(async () => {
  await factorUser.userInitialized()

  const r = await fictionModel.requests.QueryRenders.projectRequest({})

  console.log('RENDERS', r.data)
  renders.value = (r.data || []).map((rc) => {
    return new Render({ ...rc, fictionModel })
  })

  loadingPage.value = false
})
</script>

<template>
  <AdminPage :loading="loadingPage">
    <ElRenderIndex :renders="renders" />
  </AdminPage>
</template>
