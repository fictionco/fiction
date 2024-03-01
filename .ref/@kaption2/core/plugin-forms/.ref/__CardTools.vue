<script lang="ts" setup>
import { vue } from '@factor/api'

const props = defineProps({
  items: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'useTool', payload: string): void
}>()

function handleEmit(name?: string) {
  if (name)
    emit('useTool', name)
}

const tools = [
  {
    name: 'move',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
</svg>`,
    class: 'cursor-move',
  },
  {
    name: 'delete',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>`,
    class: 'cursor-pointer',
  },
  {
    name: 'add',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
</svg>`,
    class: 'cursor-pointer',
  },
  {
    name: 'edit',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
</svg>`,
    class: 'cursor-pointer',
  },
] as const

const showTools = vue.computed(() => {
  return props.items.map((item) => {
    return tools.find(t => t.name === item)
  })
})
</script>

<template>
  <div class="px-2 text-right text-sm transition-all">
    <div
      v-for="(item, i) in showTools"
      :key="i"
      :class="item?.class"
      :title="item?.name"
      class="rounded-md p-2 text-slate-400 transition-all hover:bg-slate-50 active:scale-90 active:bg-slate-100"
      @click.stop="handleEmit(item?.name)"
    >
      <div v-html="item?.icon" />
    </div>
  </div>
</template>
