<template>
  <div class="portfolio-single-entry">
    <div v-if="!isEmpty(post)">
      <component
        :is="setting(`portfolio.components.${comp}`)"
        v-for="(comp, i) in setting('portfolio.layout.single')"
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
  shareImage,
} from "@factor/api"

import { factorError404 } from "@factor/ui"

export default {
  components: { factorError404 },
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id),
    }
  },
  computed: {
    post() {
      return stored("post") || {}
    },
  },
  methods: { isEmpty, setting },
}
</script>

<style lang="less">
.portfolio-single-entry {
  background: var(--color-bg-alt);

  .featured-image-wrap,
  .entry-meta,
  .post-entry,
  .author-card {
    padding: 1em 2em;
  }

  .return-link {
    margin: 0;
    padding: 1em 2em;
    .back {
      color: var(--color-primary);
      font-weight: var(--font-weight-bold);
      &:hover {
        color: var(--color-primary-dark);
      }
    }
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
