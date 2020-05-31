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
  computed: {
    post() {
      return stored("post") || {}
    },
  },
  methods: { setting },
}
</script>

<style lang="less">
.plugin-jobs.careers {
  .single-entry {
    max-width: 50rem;
    margin: 0 auto 6rem;

    .jobs-entry {
      margin: 0;
      .entry-container > p:first-of-type {
        font-weight: inherit;
      }
    }

    .entry-title {
      display: block;
    }

    .post-entry {
      padding: 0;
      @media (max-width: 767px) {
        padding: 0 1em;
      }

      .highlight-code-wrap {
        margin: 0 auto;
        line-height: 1.2;
        max-width: 800px;
        margin-top: -80px;
        background: #fff;
        border-radius: 0.5em 0.5em 0 0;
        padding: 3rem 3rem 0;

        @media (max-width: 767px) {
          padding: 1.5rem 1rem 0;
        }
      }
    }
  }
}
</style>
