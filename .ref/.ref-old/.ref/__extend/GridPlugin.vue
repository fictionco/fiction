<template>
  <div class="grid-plugin-container">
    <header v-if="title" class="mb-4">
      <h1 class="font-bold text-md uppercase text-color-500 tracking-wide">
        {{ title }}
      </h1>
    </header>
    <div class="plugin-grid">
      <div
        v-for="(item, index) in extensions"
        :key="index"
        class="grid-item-plugin"
        @click="
          $router.push({
            path: `/plugin/${encodeURIComponent(item.path)}`,
          })
        "
      >
        <div
          class="entry-media"
          :style="mediaStyle(item)"
          :class="imageStyle(item)"
        >
          <img
            :src="item.icon"
            :alt="`${item.title} Icon`"
            class="extend-icon"
          />
        </div>
        <div class="entry-content">
          <h3 class="title">
            {{ item.title }}
            <span v-if="item.pro" class="pro-badge">Pro</span>
          </h3>
          <p class="description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { stored } from "@factor/api"
import { FactorExtensionInfo } from "./types"

export default {
  components: {},
  props: {
    title: { type: String, default: () => {} },
    extensions: { type: Array, default: () => {} },
  },
  data() {
    return {}
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: {
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
    imageStyle(this: any, item: FactorExtensionInfo) {
      const sc = this.getPrimaryScreenshot(item)
      return sc ? "screenshot" : "icon"
    },
    mediaStyle(this: any, item: FactorExtensionInfo) {
      const sc = this.getPrimaryScreenshot(item)

      return sc
        ? {
            backgroundImage: `url(${sc})`,
          }
        : {
            backgroundColor: item.themeColor,
            backgroundImage: `url(${item.icon})`,
            backgroundPosition: "50% 50%",
          }
    },
  },
}
</script>

<style lang="less">
.grid-plugin-container {
  .section-header {
    margin-bottom: 1rem;
    .title {
      font-size: 0.9rem;
      text-transform: uppercase;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.5px;
      color: var(--color-text-secondary);
      @media (max-width: 900px) {
        font-size: 1.7em;
        line-height: 1.2;
      }
    }
  }

  .plugin-grid {
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
      &.icon {
        background-size: contain;
      }
      img {
        width: 60px;
        right: 1rem;
        bottom: 0;
        position: absolute;
        border-radius: 8px;
        transform: translateY(50%);
        box-shadow: var(--panel-shadow);
      }
    }

    .entry-content {
      padding: 1.5rem;

      .title {
        display: inline-flex;
        align-items: center;
        color: var(--color-text);
        font-weight: var(--font-weight-bold, 700);
        font-size: 1.3em;
        letter-spacing: -0.02em;

        .pro-badge {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          border: 1px solid var(--color-text-secondary);
          border-radius: 25px;
          padding: 0.1rem 0.8rem;
          margin-left: 0.5rem;
          letter-spacing: 0.5px;
        }
      }
      .description {
        font-size: 1em;
        color: var(--color-text);
        opacity: 0.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .meta {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        color: var(--color-text);
        opacity: 0.5;
        .category {
          font-weight: var(--font-weight-bold, 700);
          text-transform: uppercase;
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>
