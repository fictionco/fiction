<template>
  <div class="entry-header">
    <div class="entry-header-inner">
      <component :is="setting('blog.components.returnLink')" />

      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>

      <h3 class="entry-synopsis">{{ post.synopsis }}</h3>

      <factor-post-edit :post-id="post._id" />
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { postLink, standardDate, setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    url: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    avatar(this: any) {
      return stored(this.post.avatar) || {}
    },
    avatarUrl(this: any) {
      return this.avatar.url || ""
    },
    featuredImage(this: any) {
      const style = {
        backgroundImage: `url(${this.avatarUrl})`
      }
      return style
    }
  },
  methods: {
    postLink,
    setting,
    standardDate
  }
})
</script>
<style lang="less">
.plugin-blog {
  .single-entry .entry-header {
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;

    .mast {
      padding: 0 2em;
      line-height: 1.2;
      max-width: 1000px;
      margin: 0 auto;
    }

    .entry-header-inner {
      position: relative;
      align-items: center;
      padding: 3em 3em 0;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      @media (max-width: 900px) {
        padding: 0 1em;
      }
      .return-link {
        font-size: 1.1em;
        text-transform: uppercase;
      }
      .entry-title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.3em 0;
        @media (max-width: 900px) {
          font-size: 2em;
        }
      }
      .edit {
        display: block;
        font-size: 1rem;
        line-height: 1em;
        letter-spacing: initial;
        margin: 0.5em 0;
      }
      .entry-synopsis {
        font-size: 1.2em;
        line-height: 1.6em;
        opacity: 0.5;
      }
    }
  }
}
</style>
