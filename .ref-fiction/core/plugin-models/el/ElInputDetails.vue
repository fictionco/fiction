<script lang="ts" setup>
import type { ListItem } from '@factor/api'
import { vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'

defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
})

const vis = vue.ref(false)

vue.onMounted(async () => {})
</script>

<template>
  <div>
    <ElButton
      v-if="!vis"
      size="xs"
      @click="vis = !vis"
    >
      {{
        !vis ? `Show Details` : `Hide Details`
      }}
    </ElButton>
    <div v-if="vis" class="border-theme-300 rounded-md border px-4 py-3">
      <ElButton
        class="float-right"
        size="xs"
        @click="vis = !vis"
      >
        Hide
      </ElButton>
      <div
        v-for="(item, i) in list"
        :key="i"
        class="text-xs"
      >
        <div
          class="text-theme-400 text-[10px] font-semibold uppercase tracking-wider"
        >
          {{ item.name }}
        </div>
        <div class="font-semibold">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>
