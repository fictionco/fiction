<template>
  <div class="entry-title">
    <h1 itemprop="title">
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>

    <span
      v-if="post.jobLocation"
      itemprop="jobLocation"
      itemscope
      itemtype="http://schema.org/Place"
      class="location"
    >{{ post.jobLocation }}</span>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"

export default {
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: { postLink },
}
</script>
<style lang="less">
.plugin-jobs {
  .entry-title {
    display: grid;
    grid-template-columns: 1fr 200px;
    h1 {
      display: inline-block;
      max-width: 65%;
      font-size: 1.6em;
      font-weight: var(--font-weight-bold, 700);

      line-height: 1.2;
      a {
        color: inherit;
      }
      @media (max-width: 767px) {
        display: block;
        max-width: 100%;
      }
    }
    .location {
      float: right;
      font-size: 0.9em;
      line-height: 1.8em;
      color: var(--color-text-secondary);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: right;
      @media (max-width: 767px) {
        float: none;
        text-align: left;
      }
    }

    @media (max-width: 767px) {
      display: flex;
      flex-direction: column-reverse;
    }
  }
}
</style>
