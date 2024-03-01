<script lang="ts" setup>
import type { ActionItem } from '@factor/api'
import { vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import { useFictionApp } from '../../util'
import ElModalList from './ElModalList.vue'
import ElModelStart from './ElModelStart.vue'

const { factorRouter } = useFictionApp()

const actions: ActionItem[] = [
  {
    name: `New Model`,
    href: factorRouter.link('modelIndex', {}, { create: 1 }).value,
    btn: 'primary',
  },
]

const startModelVis = vue.computed(
  () => !!(factorRouter.query.value.create as string),
)

async function removeQuery() {
  // remove create from query url
  await factorRouter.replace({ query: { create: undefined } })
}
</script>

<template>
  <AdminPage>
    <ElPanel title="Dreambooth Models" :actions="actions">
      <ElModalList />
    </ElPanel>
    <ElModelStart
      :vis="startModelVis"
      @update:vis="removeQuery()"
    />
  </AdminPage>
</template>
