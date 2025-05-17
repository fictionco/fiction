<script lang="ts" setup>
import type { vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
</script>

<template>
  <ElModal>
    <div class="overflow-hidden rounded-b-md pt-3">
      <iframe
        width="100%"
        class="aspect-video"
        src="https://www.youtube.com/embed/9xwazD5SyVg?si=xwlkPBPXvhiMyL1w"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  </ElModal>
</template>
