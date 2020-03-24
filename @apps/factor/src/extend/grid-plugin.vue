<template>
  <div class="plugin-grid">
    <div
      v-for="(item, index) in extensions"
      :key="index"
      class="grid-item-plugin"
      @click="$router.push({path: `/plugin/${encodeURIComponent(item.permalink)}`})"
    >
      <div class="entry-media" :style="mediaStyle(item)">
        <img :src="item.icon" :alt="`${item.title} Icon`" class="extend-icon" />
      </div>
      <div class="entry-content">
        <div class="meta">
          <div v-if="item.category" class="category">{{ item.category.join(', ') }}</div>
        </div>
        <h3 class="title">{{ item.title }}</h3>
        <p class="description">{{ item.synopsis }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { setting, stored } from "@factor/api"
import Vue from "vue"
import { FactorExtensionInfo } from "./types"

export default Vue.extend({
  components: {},
  props: {
    extensions: { type: Array, default: () => {} }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    setting,
    backgroundImageStyle(item: FactorExtensionInfo) {
      return { backgroundImage: `url(${this.getPrimaryScreenshot(item)})` }
    },
    getScreenshots(this: any, item: FactorExtensionInfo): string[] {
      if (!item.screenshots) return []
      return item.screenshots
    },
    getPrimaryScreenshot(item: FactorExtensionInfo) {
      const screenshots = this.getScreenshots(item)

      return screenshots[0] ?? ""
    },
    mediaStyle(this: any, item: FactorExtensionInfo) {
      const sc = this.getPrimaryScreenshot(item)

      if (sc) {
        return {
          backgroundImage: `url(${sc})`
        }
      } else {
        return {
          backgroundImage: `url(${item.icon})`,
          backgroundPosition: "50% 50%"
        }
      }
    }
  }
})
</script>

<style lang="less">
.plugin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.grid-item-plugin {
  display: block;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: var(--panel-shadow);
  cursor: pointer;
  transition: 0.1s cubic-bezier(0.52, 0.01, 0.16, 1);
  &:hover {
    opacity: 0.9;
  }

  .entry-media {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 0%;
    position: relative;
    max-width: 100%;
    position: relative;
    padding: 25%;
    box-shadow: 0px 1px 0 rgba(50, 50, 93, 0.13);
    img {
      width: 80px;
      right: 0;
      bottom: 0;
      position: absolute;
      border-radius: 8px;
      transform: translate(-50%, 50%);
      box-shadow: var(--panel-shadow);
    }
  }

  .entry-content {
    padding: 1.5rem;
    .meta {
      font-size: 0.9em;
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
      .category {
        color: var(--color-primary);
      }
    }
    .title {
      color: var(--color-text);
      font-weight: var(--font-weight-bold, 700);
      font-size: 1.6em;
      letter-spacing: -0.02em;
    }
    .description {
      font-size: 1.2em;
      color: var(--color-text);
      opacity: 0.5;
      // Unofficial line clamp works on all major browsers except IE
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
