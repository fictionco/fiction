<template>
  <div class="single-entry">
    <component
      :is="setting(`jobs.components.${comp}`)"
      v-for="(comp, i) in setting('jobs.layout.single')"
      :key="i"
      :post-id="post._id"
    />
  </div>
</template>
<script lang="ts">
import { setting, stored, titleTag, descriptionTag, shareImage } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id)
    }
  },
  routeClass() {
    return "nav-white"
  },
  computed: {
    post() {
      return stored("post") || {}
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.single-entry {
  .widget-date,
  .entry-meta,
  .post-entry,
  .social-share {
    max-width: 50rem;
    margin: 1rem auto;
    padding: 0;
  }

  @media (max-width: 767px) {
    .return-link,
    .entry-headers,
    .post-entry,
    .entry-meta,
    .social-share {
      padding: 0 1em;
    }
  }
}
</style>
