<template>
  <div class="entry-tags-wrap">
    <div />
    <div v-if="tags.length > 0" class="entry-tags">
      <factor-link
        v-for="(tag, ti) in tags"
        :key="ti"
        class="entry-tag rounded-full bg-blue-500 text-white hover:bg-blue-700"
        :path="setting('work.indexRoute')"
        :query="{ tag }"
      >{{ tag }}</factor-link>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    tags(this: any) {
      return this.post.tag || []
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.entry-tags-wrap {
  max-width: 70rem;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 2rem;
  padding: 0 2em;

  .entry-tags {
    line-height: 1;

    a {
      display: inline-block;
      font-size: 0.85em;
      font-weight: var(--font-weight-bold);
      margin: 5px 5px 5px 0;
      padding: 5px 10px;
      text-decoration: none;
      border-radius: 3px;

      &:not(:nth-child(1)) {
        margin-left: 3px;
      }
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
    padding: 0;
    .entry-tags {
      padding: 0;
    }
  }
}
</style>
