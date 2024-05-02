<script lang="ts" setup>
import type { vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import AdminEditItem from '@fiction/admin/AdminEditItem.vue'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <AdminEditItem :controller="{}">
    <template #headerLeft>
      <ElButton btn="default" :href="card.link('/')">
        <div class="i-tabler-home text-lg" />
      </ElButton>
      <div class="flex space-x-1 font-medium">
        <RouterLink
          class="text-theme-400 block pr-1 hover:text-primary-500"
          :to="card.link('/')"
        >
          Site Builder /
        </RouterLink>
      </div>
    </template>
    <template #headerRight>
      xxx
    </template>
    <template #default>
      ddd
    </template>
  </AdminEditItem>
</template>
