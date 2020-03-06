<template>
  <div class="work-single-entry">
    <div v-if="!isEmpty(post)">
      <component
        :is="setting(`work.components.${comp}`)"
        v-for="(comp, i) in setting('work.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <factor-error-404 v-else />
  </div>
</template>
<script lang="ts">
import {
  isEmpty,
  setting,
  stored,
  titleTag,
  descriptionTag,
  shareImage
} from "@factor/api"
import { factorError404 } from "@factor/ui"
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
    },
    settings(this: any) {
      return this.post.settings || {}
    }
  },
  methods: {
    isEmpty,
    setting
  }
})
</script>

<style lang="less">
.work-single-entry {
  padding: 2em 2em 6em;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .work-return-link,
  .splash,
  .single-entry-headers,
  .widget-date,
  .entry-meta,
  .social-share,
  .author-bio {
    line-height: 1.2;
    max-width: 50rem;
    margin-left: auto;
    margin-right: auto;
  }

  .post-entry {
    line-height: 1.2;
    max-width: 70rem;
    margin-left: auto;
    margin-right: auto;
  }

  .return-link {
    padding: 2em 2em 1em;
  }

  .entry-meta,
  .post-entry,
  .social-share,
  .author-card {
    padding: 1em 2em;
  }

  .entry-meta {
    justify-content: normal;
  }
  .featured-image {
    border-radius: 0;
  }

  @media (max-width: 900px) {
    .return-link,
    .entry-tags,
    .entry-meta,
    .post-entry,
    .social-share,
    .author-card {
      padding: 1em 0;
    }
  }
}
</style>
