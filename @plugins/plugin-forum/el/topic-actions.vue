<template>
  <div class="topic-actions">
    <factor-menu :list="['edit', 'reply', 'flag']" @action="$emit('action', $event)" />
  </div>
</template>
<script lang="ts">
import { factorMenu } from "@factor/ui"

export default {
  components: { factorMenu },
}
</script>
<style lang="less">
.topic-post-author {
  .factor-icon {
    margin-right: 0.5rem;
  }
}
</style>
