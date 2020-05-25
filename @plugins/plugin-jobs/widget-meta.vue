<template>
  <div class="entry-meta">
    <span class="m-item date">
      Updated
      <strong>{{ standardDate(post.updatedAt) }}</strong>
    </span>

    <span v-if="post.jobType" class="m-item type">{{ post.jobType }}</span>

    <factor-link
      v-if="post.jobCompanyName && post.jobCompanyWebsite"
      :path="post.jobCompanyWebsite"
      target="_blank"
      class="m-item company"
    >{{ post.jobCompanyName }}</factor-link>
    <span v-else-if="post.jobCompanyName" class="m-item company">{{ post.jobCompanyName }}</span>

    <factor-post-edit class="m-item" :post-id="post._id" />
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { setting, standardDate, stored } from "@factor/api"
import { factorLink } from "@factor/ui"

export default {
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: { setting, standardDate },
}
</script>
<style lang="less">
.plugin-jobs {
  .entry-meta {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-top: 0.5rem;
    font-size: 0.85em;

    .m-item {
      margin-right: 0.5rem;

      background: var(--color-bg-contrast);
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
    }
    @media (max-width: 767px) {
      display: block;
      .m-item {
        display: inline-block;
        margin: 0 0.5rem 0.5rem 0;
      }
    }
  }
}
</style>
