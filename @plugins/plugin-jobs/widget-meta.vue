<template>
  <div class="entry-meta">
    <component
      :is="setting(`jobs.components.${comp}`)"
      v-for="(comp, i) in setting('jobs.layout.meta')"
      :key="i"
      :post-id="postId"
    />
  </div>
</template>
<script lang="ts">
import { setting, stored } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.entry-meta {
  display: flex;
  align-items: center;
  margin-right: 1em;
  padding: 0.3em 0;
  justify-content: space-between;
}
</style>