<script lang="ts" setup>
import type { FictionAdmin } from '@fiction/admin'
import type { CompletionTaskWithStatus } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'

defineOptions({
  name: 'TasksWidget',
})

const { card } = defineProps<{ card: Card }>()
const { fictionAdmin } = useService<{ fictionAdmin: FictionAdmin }>()

const loading = vue.ref(true)
const availableTasks = vue.ref<CompletionTaskWithStatus[]>([])

// Calculate progress metrics
const completedCount = vue.computed(() => availableTasks.value.filter(task => task.status === 'ready').length)
const totalCount = vue.computed(() => availableTasks.value.length)
const progressPercent = vue.computed(() => (completedCount.value / totalCount.value) * 100)
const currentIndex = vue.computed(() => availableTasks.value.findIndex(task => task.status !== 'ready'))

vue.onMounted(async () => {
  loading.value = true
  try {
    availableTasks.value = await fictionAdmin.tasks.getTasks()
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="!loading" class="space-y-4">
    <!-- Header with progress indicator -->
    <div class="flex items-center justify-between text-sm">
      <div class="font-medium">
        Tasks
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-theme-600 dark:text-theme-400">{{ completedCount }} of {{ totalCount }}</span>
        <div class="w-24 h-1 bg-theme-200 dark:bg-theme-700 rounded-full overflow-hidden">
          <div class="h-full bg-primary-500 dark:bg-primary-600 rounded-full" :style="{ width: `${progressPercent}%` }" />
        </div>
      </div>
    </div>

    <!-- Task list -->
    <div class="space-y-3">
      <XLink
        v-for="(task, i) in availableTasks"
        :key="task.key"
        :href="task.href"
        class="group flex items-center gap-3 py-2 px-3 -mx-3 rounded-md transition-colors hover:bg-theme-50 dark:hover:bg-theme-800"
        @click.stop
      >
        <!-- Status indicator -->
        <div
          class="size-5 rounded-full flex items-center justify-center flex-shrink-0"
          :class="task.status === 'ready'
            ? 'bg-primary-500 dark:bg-primary-600'
            : currentIndex === i
              ? 'border-2 border-theme-400 dark:border-theme-300'
              : 'border border-theme-300 dark:border-theme-600'"
        >
          <i v-if="task.status === 'ready'" class="i-tabler-check text-white text-sm" />
        </div>

        <!-- Task title -->
        <span
          class="flex-grow transition-colors"
          :class="task.status === 'ready' ? 'text-theme-400 dark:text-theme-500 line-through' : ''"
        >
          {{ task.title }}
        </span>

        <!-- Action indicator -->
        <i class="i-tabler-chevron-right text-theme-300 dark:text-theme-600 group-hover:text-theme-500 dark:group-hover:text-theme-400 transition-colors" />
      </XLink>
    </div>
  </div>
</template>
