<template>
  <div class="plugins-gallery-container">
    <div class="plugins-gallery-header">
      <div class="text">
        <h2 class="title">{{ title }}</h2>
        <div class="sub">{{ text }}</div>
      </div>
      <div class="action">
        <factor-link btn="default" path="/plugins">Browse All &rarr;</factor-link>
      </div>
    </div>

    <factor-spinner v-if="loading" />
    <div v-else-if="extensionType == 'plugin'" class="plugins-gallery">
      <a
        v-for="(item, index) in extensions"
        :key="index"
        class="gallery-item-plugin"
        :href="`/plugin/${encodeURIComponent(item.permalink)}`"
      >
        <img :src="item.icon" :alt="`${item.title} Icon`" class="plugin-icon" />
        <div class="entry-content">
          <h1 class="title">{{ item.title }}</h1>
          <p class="description">{{ item.synopsis }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { stored } from "@factor/api"
import { factorLink, factorSpinner } from "@factor/ui"
import { requestIndex } from "../extend/request"

export default {
  components: {
    factorLink,
    factorSpinner,
  },
  props: {
    title: { type: String, default: "Latest Plugins" },
    text: {
      type: String,
      default: "Create and run your web app with Factor and extensions.",
    },
  },
  data() {
    return {
      loading: false,
      postType: "extension",
      extensionType: "plugin",
    }
  },
  serverPrefetch(this: any) {
    return this.getPosts()
  },
  computed: {
    extensions(this: any) {
      const storeKey = [this.postType, this.extensionType].join("")
      const index = stored(storeKey) || {}
      return index.posts ?? []
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },
  mounted() {
    if (this.extensions.length == 0) {
      this.getPosts()
    }
  },
  methods: {
    async getPosts(this: any) {
      this.loading = true

      await requestIndex({ extensionType: this.extensionType })

      this.loading = false
    },
  },
}
</script>
<style lang="less">
.plugins-gallery-container {
  .plugins-gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
    .title {
      font-size: 1.4em;
      font-weight: var(--font-weight-bold, 700);
    }
    .sub {
      color: var(--color-text-secondary);
    }
  }

  .spinner-wrap {
    min-height: 400px;
  }

  .plugins-gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .gallery-item-plugin {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 1rem 1rem 1rem 0;
    color: var(--color-text);

    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #fff;
      z-index: -1;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      border-radius: 4px;
      opacity: 0;
      transform: scale(0.95);
      transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    &:hover {
      .plugin-icon {
        transform: scale(0.75);
      }
      .title,
      .description {
        color: var(--color-text);
      }
      &:before {
        transform: scale(1);
        opacity: 1;
      }
    }

    .plugin-icon {
      width: 64px;
      height: 64px;
      border-radius: 0.5rem;
      box-shadow: 0 2.5px 5px -1px rgba(50, 50, 93, 0.25),
        0 1.5px 3px -1.5px rgba(0, 0, 0, 0.3);
      background-color: #fff;
      margin: 0 20px 0 0;
      display: block;
      flex-shrink: 0;
      transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
      transform-origin: right top;
    }
    .title {
      font-weight: 700;
      font-size: 1.2em;
      line-height: 1.5em;
      margin-bottom: 0.3rem;
    }
    .description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 2.7em; /* exactly two lines */
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      opacity: 0.5;
    }
  }
}
</style>
