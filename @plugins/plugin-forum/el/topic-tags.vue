<template>
  <div class="tags">
    <factor-link
      v-for="tag in tags"
      :key="tag"
      class="tag"
      :path="setting(`forum.indexRoute`)"
      :query="{ tag }"
    >{{ tag }}</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api/settings"
export default {
  components: {
    factorLink,
  },
  props: {
    tags: { type: Array, default: () => [] },
  },
  methods: {
    setting,
  },
}
</script>
<style lang="less">
.tags {
  font-size: 0.85em;
  .tag {
    color: var(--color-text-secondary, inherit);
    border-radius: 5px;
    padding: 0 0.5rem;
    display: inline-block;
    margin: 0.25rem 0 0.25rem 0.5rem;
    font-weight: var(--font-weight-bold);
    background: var(--color-bg-contrast);
  }
}
</style>
