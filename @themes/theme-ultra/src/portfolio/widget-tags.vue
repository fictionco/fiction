<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <factor-link
      v-for="(tag, ti) in tags"
      :key="ti"
      class="entry-tag hover:text-white"
      :path="setting('portfolio.indexRoute')"
      :query="{ tag }"
    >{{ tag }}</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored } from "@factor/app/store"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    tags(this: any) {
      return this.post.tag || []
    },
  },
  methods: {
    setting,
  },
})
</script>
<style lang="less">
.entry-tags {
  line-height: 1.4;
  max-width: 800px;
  margin: 0 auto;
  padding: 1em 2em;

  a {
    display: inline-block;
    font-size: 0.85rem;
    font-weight: var(--font-weight-bold);
    margin: 5px 5px 5px 0;
    padding: 2px 7px;
    text-decoration: none;
    border-radius: 3px;
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);

    &:hover {
      opacity: 1;
      background: var(--color-primary);
    }
    &:not(:nth-child(1)) {
      margin-left: 3px;
    }
  }
}
</style>
