<template>
  <div class="entry-meta">
    <span class="date">Posted {{ standardDate(post.date) }}</span>

    <span v-if="post.jobType" class="type">{{ post.jobType }}</span>

    <factor-link
      v-if="post.jobCompanyName && post.jobCompanyWebsite"
      :path="post.jobCompanyWebsite"
      target="_blank"
      class="company"
    >{{ post.jobCompanyName }}</factor-link>
    <span v-else-if="post.jobCompanyName" class="company">{{ post.jobCompanyName }}</span>
  </div>
</template>
<script lang="ts">
import { setting, standardDate, stored } from "@factor/api"
import { factorLink } from "@factor/ui"
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
  },
  methods: { setting, standardDate },
})
</script>
<style lang="less">
.plugin-jobs {
  .entry-meta {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-top: 0.5rem;
    font-size: 0.9em;

    .company,
    .location,
    .date,
    .type {
      margin-right: 0.5em;

      &:first-child:before {
        margin-right: 0;
        border-left: none;
      }
      &:before {
        margin-right: 0.5em;
        border-left: 1px solid rgba(0, 0, 0, 0.3);
        content: "";
      }

      @media (max-width: 767px) {
        display: block;
      }
    }
  }
}
</style>
