<template>
  <div class="entry-headers">
    <div class="splash">
      <factor-link class="back label label-aqua" :path="setting('jobs.indexRoute')">
        <factor-icon icon="arrow-left" />
        <span>All Jobs</span>
      </factor-link>
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>

      <p class="entry-location">{{ post.jobLocation }}</p>

      <h3 class="entry-sub-title">{{ post.subTitle }}</h3>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { postLink, setting }
})
</script>
<style lang="less">
.single-entry .entry-headers {
  margin: 0;
  padding: 0 2em;
  background: #1b223c url(./img/rectangles-pink.svg) no-repeat center center;
  background-size: 80%;

  @media (max-width: 767px) {
    background-size: 100%;
    padding: 0 1em;
  }

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    &.label-aqua {
      color: #ff0076;
      &:hover {
        color: #ff0076;
        opacity: 0.7;
      }
    }
  }

  .splash {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 60px;
    align-items: center;
    text-align: left;
    max-width: 50rem;
    padding: 5em 0;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 6em 1em 4em;
    }

    .entry-title {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 1.4em;
      margin: 0.3em 0 0;
      color: #f9f9f9;
      a:hover {
        color: inherit;
        opacity: 0.5;
      }
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .entry-location {
      font-size: 1.4em;
      font-weight: 400;
      margin-bottom: 1.5em;
      color: #fff;

      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .entry-sub-title {
      opacity: 0.5;
      font-size: 1.4em;
      font-weight: 400;
      margin-bottom: 1.5em;
      color: #d9d9d9;

      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }

  .entry-title {
    font-weight: var(--font-weight-bold, 800);
    font-size: 2.5em;
    line-height: 1.1;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: inherit;
      &:hover {
        color: var(--color-primary, #0496ff);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }
  .entry-sub-title {
    font-size: 1.4em;
    opacity: 0.7;
  }
}
</style>
