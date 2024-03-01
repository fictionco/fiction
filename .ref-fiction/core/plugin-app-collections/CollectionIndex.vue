<script lang="ts" setup>
import type { ActionItem } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import { useFictionApp } from '../util'
import CollectionList from './CollectionList.vue'

const { factorRouter } = useFictionApp()

const actions: ActionItem[] = [
  {
    name: `New Collection`,
    href: factorRouter.link('collectionEdit', { collectionId: '' }).value,
    btn: 'primary',
  },
]
</script>

<template>
  <AdminPage>
    <ElPanel title="Your Collections" :actions="actions">
      <CollectionList />
    </ElPanel>
  </AdminPage>
</template>
