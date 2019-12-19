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
.jobs-content {
  .single-entry {
    .entry-headers .splash {
      padding: 6em 0 8em;
      @media (max-width: 767px) {
        padding: 6em 0 7em;
      }
    }
    .post-entry {
      padding: 0;
      margin: 0;
      @media (max-width: 767px) {
        padding: 0 1em 3em;
      }

      .highlight-code-wrap {
        margin: 0 auto;
        line-height: 1.2;
        max-width: 800px;
        margin-top: -80px;
        background: #fff;
        border-radius: 0.5em;
        padding: 3em 3em 0;

        @media (max-width: 767px) {
          padding: 1.5em 1em 0;
        }
      }
    }

    .job-entry-cta {
      max-width: 800px;
      margin: 1em auto;
      padding: 0 3em;
      @media (max-width: 767px) {
        padding: 0 1em;
      }
    }
  }
}

// .single-entry {
//   .widget-date,
//   .entry-meta,
//   .post-entry,
//   .social-share {
//     max-width: 50rem;
//     margin: 1rem auto;
//     padding: 0;
//   }

//   @media (max-width: 767px) {
//     .return-link,
//     .entry-headers,
//     .post-entry,
//     .entry-meta,
//     .social-share {
//       padding: 0 1em;
//     }
//   }
// }
</style>
