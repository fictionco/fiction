<template>
  <div v-if="format == 'index'" class="entry-headers">
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-subtitle text-gray-600">{{ post.synopsis }}</h3>
  </div>
  <div v-else class="entry-headers">
    <div class="splash">
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
      <h3 class="entry-subtitle text-gray-600">{{ post.synopsis }}</h3>
      <factor-post-edit :post-id="post._id" />
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { postLink, setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    postLink,
    setting
  }
})
</script>
<style lang="less">
// Index
.work-post {
  .entry-headers {
    margin: -2rem 1rem 0;
    padding: 1rem;
    background: #fff;
    border-radius: 0.5rem;
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

    .entry-title {
      font-weight: var(--font-weight-bold);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      a {
        color: inherit;
        &:hover {
          color: var(--color-primary);
        }
      }
    }
    .entry-subtitle {
      line-height: 1.6;
    }
  }

  &:hover {
    .entry-headers {
      margin: -3rem 1rem 1rem;
      margin-bottom: 1rem;
      box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.15), 0px 5px 5px rgba(0, 0, 0, 0.05);
    }
  }
}

// Single
.work-single-entry {
  .splash {
    position: relative;
    background: #fff;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.15), 0 5px 5px rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    z-index: 5;
    padding: 2em;

    .entry-title {
      font-weight: var(--font-weight-bold);
      font-size: 3em;
      letter-spacing: -0.03em;
      margin-bottom: 0.5rem;

      a {
        color: inherit;
      }
    }
    .entry-subtitle {
      font-size: 1.25em;
      line-height: 1.6em;
    }
    .edit {
      display: block;
      margin-top: 1rem;
      color: var(--color-primary);
    }

    @media (max-width: 900px) {
      padding: 0;
      box-shadow: none;

      .entry-title {
        font-size: 2em;
      }
      .entry-subtitle {
        font-size: 1em;
      }
    }
  }
}
</style>
