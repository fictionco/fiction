<script setup lang="ts">
import { getNavComponentType, useService, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import type { FactorAdmin } from '..'

const { factorAdmin, factorRouter } = useService<{ factorAdmin: FactorAdmin }>()

const currentPanel = vue.computed(() => factorAdmin.settingsViews.value.find(p => p.viewId === (factorRouter.current.value.params.itemId || 'general')))
</script>

<template>
  <ElPanel box-class="p-0 ">
    <div class="flex">
      <div class="border-theme-300 w-40 shrink-0 rounded-l-md border-r pb-32">
        <div class="text-theme-300 p-3 font-semibold text-sm">
          Settings
        </div>
        <div class="space-y-0">
          <component
            :is="getNavComponentType(v)"
            v-for="(v, i) in factorAdmin.settingsNav.value"
            :key="i"
            class="hover:bg-theme-100 flex items-center space-x-2 px-3 py-2.5 text-sm font-semibold"
            :to="v.href"
            :href="v.href"
            :class=" v.isActive ? 'bg-theme-100 text-theme-900' : 'text-theme-500' "
          >
            <div v-if="v.icon" class="text-[1.4em]">
              <div :class="v.icon" />
            </div>
            <div>{{ v.name }}</div>
          </component>
        </div>
      </div>
      <div class="grow min-w-0">
        <component :is="currentPanel?.el" />
      </div>
    </div>
  </ElPanel>
</template>
