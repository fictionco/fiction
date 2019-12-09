<template>
  <div class="news-single-entry">
    <div v-if="!isEmpty(post)">
      <component
        :is="setting(`news.components.${comp}`)"
        v-for="(comp, i) in setting('news.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <factor-error-404 v-else />
  </div>
</template>
<script lang="ts">
import { factorError404 } from "@factor/ui"
import { stored } from "@factor/app/store"
import { setting } from "@factor/api/settings"
import { titleTag, descriptionTag, shareImage } from "@factor/api/metatags"
import { isEmpty } from "@factor/api/utils-lodash"
import Vue from "vue"
export default Vue.extend({
  components: { factorError404 },
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
  computed: {
    post() {
      return stored("post") || {}
    }
  },
  methods: { isEmpty, setting }
})
</script>

<style lang="less">
.news-single-entry {
  background: var(--color-bg-alt);
  overflow: hidden;

  .featured-image-wrap,
  .entry-meta,
  .post-entry,
  .author-card {
    padding: 1em 2em;
  }

  .entry-meta {
    justify-content: normal;
  }

  @media (max-width: 900px) {
    .return-link,
    .entry-meta,
    .author-card {
      padding: 1em;
    }
  }
}
</style>
