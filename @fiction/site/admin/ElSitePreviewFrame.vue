<script lang="ts" setup>
defineOptions({
  name: 'ManageIndex',
})

defineProps<{
  url: string
}>()
</script>

<template>
  <div
    v-if="url"
    class="relative overflow-hidden bg-theme-50 dark:bg-theme-950 aspect-[1/1]"
  >
    <iframe
      v-if="url"
      :src="url"
      class="absolute inset-0  w-[500%] h-[500%] transform scale-[20%] origin-top-left pointer-events-none"
      loading="lazy"
      title="Site preview"
    />
    <div v-else class="flex items-center justify-center h-full text-theme-400 dark:text-theme-500">
      <span class="i-tabler-photo text-5xl" />
    </div>

    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  </div>
</template>
