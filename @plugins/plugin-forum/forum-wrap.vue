<template>
  <div class="forum-wrap">
    <div class="forum-layout">
      <forum-sidebar />
      <div class="forum-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api/settings"

export default Vue.extend({
  components: {
    forumSidebar: setting("forum.components.forumSidebar")
  }
})
</script>

<style lang="less">
.forum-wrap {
  margin: 6rem 0;
  .forum-layout {
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(225px, 250px) 1fr;
    grid-gap: 2rem;
    padding: 1rem;
  }
}
</style>
