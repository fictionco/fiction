<template>
  <div class="portfolio-single-entry">
    <div v-if="!$lodash.isEmpty(post)">
      <component
        :is="$setting.get(`portfolio.components.${comp}`)"
        v-for="(comp, i) in $setting.get('portfolio.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
import Factor from "vue"
export default {
  data() {
    return {}
  },
  metatags() {
    return {
      title: this.$metatags.titleTag(this.post._id),
      description: this.$metatags.descriptionTag(this.post._id),
      image: this.$metatags.shareImage(this.post._id)
    }
  },
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  },
  methods: {}
}
</script>

<style lang="less">
.portfolio-single-entry {
  .return-link,
  .entry-tags,
  .single-entry-headers,
  .widget-date,
  .entry-meta,
  .post-entry,
  .social-share,
  .author-bio {
    line-height: 1.2;
    max-width: 50rem;
    margin: 0 auto;
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

  @media (max-width: 767px) {
    .return-link,
    .entry-meta,
    .social-share,
    .author-card {
      padding: 1em;
    }
  }
}
</style>
