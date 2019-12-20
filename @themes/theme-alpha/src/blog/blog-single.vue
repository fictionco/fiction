<template>
  <div class="single-entry">
    <component
      :is="setting(`blog.components.${comp}`)"
      v-for="(comp, i) in setting('blog.layout.single')"
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
    post(this: any) {
      return stored("post") || {}
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.plugin-blog {
  .single-entry {
    .return-link,
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
      .post-entry,
      .social-share,
      .author-card {
        padding: 1em;
      }
    }
  }
}
</style>
