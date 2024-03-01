<script lang="ts" setup>
import type { PropType } from 'vue'
import type { TableAgentConfig } from '../tables'
import StandardIcon from '../ui/StandardIcon.vue'
import type { StandardIconKeys } from '../ui/types'

defineProps({
  agentConfig: {
    type: Object as PropType<Partial<TableAgentConfig>>,
    required: true,
  },
  active: { type: Boolean, default: false },
  iconKey: { type: String as PropType<StandardIconKeys>, default: undefined },
})
</script>

<template>
  <div>
    <template v-if="!active">
      <StandardIcon :icon-key="iconKey" class="h-6 w-6" />
    </template>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-6 w-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  </div>
</template>
