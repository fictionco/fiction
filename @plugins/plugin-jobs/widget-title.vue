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
      >{{ post.jobLocation }}</span
    >

    <factor-post-edit :post-id="post._id" />
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: { postLink },
})
</script>
<style lang="less">
.plugin-jobs {
  .entry-title {
    margin-bottom: 0.5rem;
    h1 {
      display: inline-block;
      max-width: 65%;
      font-size: 1.4em;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.03em;
      line-height: 1.2;
      @media (max-width: 767px) {
        display: block;
        max-width: 100%;
      }
    }
    .location {
      float: right;
      font-size: 1rem;
      line-height: 1.8em;
      font-weight: 300;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: right;
      @media (max-width: 767px) {
        float: none;
        text-align: left;
      }
    }
    .edit {
      display: block;
      font-size: 1rem;
      letter-spacing: initial;
      margin: 0.5em 0;
      @media (max-width: 767px) {
        display: none;
      }
    }
    @media (max-width: 767px) {
      display: flex;
      flex-direction: column-reverse;
    }
  }
}
</style>
