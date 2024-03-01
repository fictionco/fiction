<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { onEvent, vue } from '@factor/api'

import AdminPage from '@factor/api/plugin-admin/AdminPage.vue'
import { useKaption } from '../../utils'
import ModalSelectTemplate from './ModalSelectTemplate.vue'

const { factorRouter, factorAdmin } = useKaption()
type ModalMode = '' | 'new' | 'template'
const modalVis = vue.ref<ModalMode>('')

onEvent('newForm', (mode: ModalMode = 'template') => {
  modalVis.value = mode
})

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Forms',
      menu: [
        factorRouter.getRouteMenuItem('formIndex'),
        {
          name: 'New Form',
          onClick: () => {
            modalVis.value = 'template'
          },
        },
      ],
    },
  ]
})
</script>

<template>
  <AdminPage :menu="menu">
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />

    <ModalSelectTemplate :vis="modalVis === 'template'" @close="modalVis = ''" />
  </AdminPage>
</template>
