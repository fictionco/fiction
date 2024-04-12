<script lang="ts" setup>
import type { NavItem, vue } from '@fiction/core'
import { getNavComponentType } from '@fiction/core'

defineProps({
  item: { type: Object as vue.PropType<NavItem>, required: true },
})
</script>

<template>
  <component
    :is="getNavComponentType(item)"
    :href="item.href"
    :to="item.href"
    :target="item.target ? item.target : '_self'"
    class="group"
  >
    <span class="inline-flex items-center space-x-1 ">
      <span class="block" v-html="item.name" />
      <span v-if="item.target === '_blank'" class="block opacity-30 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all">
        <span class="block i-heroicons-arrow-up-right-20-solid" />
      </span>
    </span>
  </component>
</template>
