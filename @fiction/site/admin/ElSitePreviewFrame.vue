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
    class="relative w-full overflow-hidden bg-theme-50 dark:bg-theme-950 aspect-[16/9]"
  >
    <iframe
      v-if="url"
      :src="url"
      class="absolute inset-0  w-[200%] h-[200%] transform scale-50 origin-top-left pointer-events-none"
      loading="lazy"
      title="Site preview"
    />
    <div v-else class="flex items-center justify-center h-full text-theme-400 dark:text-theme-500">
      <span class="i-tabler-photo text-5xl" />
    </div>

    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

    <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-800/90 text-green-0 hover:bg-green-700 shadow-sm transition-colors">
        <span class="i-tabler-edit text-lg" />
      </div>
    </div>
  </div>
</template>
