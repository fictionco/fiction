<template>
  <div class="entry-title">
    <h1 itemprop="title">{{ post.title }}</h1>
    <div
      v-if="post.jobLocation"
      itemprop="jobLocation"
      itemscope
      itemtype="http://schema.org/Place"
      class="location"
    >{{ post.jobLocation }}</div>
    <div class="arrow">&rarr;</div>
  </div>
</template>
<script lang="ts">
import { stored, postLink } from "@factor/api"

export default {
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
    grid-template-columns: 1fr 10rem 3rem;
    align-items: center;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
    }

    h1 {
      font-size: 1.2em;
      line-height: 1.2;
      max-width: none;
    }
    .location {
      text-transform: uppercase;
      font-weight: 700;
      font-size: 0.9em;
      line-height: 1;
      text-align: right;
      @media (max-width: 767px) {
        text-align: left;
      }
    }
    .arrow {
      text-align: right;
      font-size: 1.6em;
      line-height: 1;
    }
  }
}
</style>
