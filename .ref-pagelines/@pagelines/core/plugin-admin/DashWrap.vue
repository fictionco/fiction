<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import AdminPage from './AdminPage.vue'

const { factorUser } = useService<{ factorUser: FactorUser }>()

const nav = vue.ref([
  {
    name: 'Overview',
    icon: 'i-carbon-rocket',
    key: 'overview',
  },
  {
    name: 'Data',
    icon: 'i-carbon-rocket',
    key: 'data',
  },
  {
    name: 'Settings',
    icon: 'i-carbon-rocket',
    key: 'settings',
  },
])

const fullNav = vue.computed(() => {
  const org = factorUser.activeOrganizationId.value
  return nav.value.map((n) => {
    return { ...n, href: `/org/${org}/chat/${n.key}` }
  })
})
</script>

<template>
  <AdminPage>
    <div
      class="border-theme-200 mx-auto mt-4 grid max-w-[1100px] grid-cols-12 gap-6 border-t px-4 py-6"
    >
      <div class="col-span-12">
        <div class="font-serif text-3xl font-bold tracking-tight">
          Chat Agents
        </div>
      </div>
      <div class="col-span-2">
        <div class="space-y-2">
          <div v-for="(item, i) in fullNav" :key="i">
            <RouterLink
              :to="item.href"
              class="py-1 font-serif text-xl"
              active-class="text-primary-500"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="col-span-10">
        <slot />
      </div>
    </div>
  </AdminPage>
</template>

<style lang="less"></style>
