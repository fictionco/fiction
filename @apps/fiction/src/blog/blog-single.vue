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

export default {
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
  routeClass() {
    return "nav-white"
  },
  computed: {
    post() {
      return stored("post") || {}
    },
  },
  methods: { setting },
}
</script>

<style lang="less">
.plugin-blog {
  .single-entry {
    padding-bottom: 6rem;

    .entry-meta {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem;
    }

    .featured-image-wrap,
    .post-entry,
    .social-share,
    .author-bio {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 3em 1em;
      @media (max-width: 767px) {
        padding: 0 1em 1em;
      }
    }
    .post-entry {
      font-size: initial;
      .highlight-code-wrap {
        font-size: 1.2em;
        line-height: 1.7em;
        @media (max-width: 767px) {
          padding: 0 1em;
        }
      }
    }
    .social-share {
      justify-content: center;
      a.social {
        color: var(--color-text-secondary);
        &.facebook,
        &.twitter,
        &.linkedin,
        &.pinterest {
          &:hover {
            color: var(--color-text);
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
