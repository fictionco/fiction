<template>
  <div class="theme-grid">
    <div
      v-for="(item, index) in extensions"
      :key="index"
      :to="`/theme/${item.permalink}`"
      class="grid-item-theme"
      @click="
        $router.push({ path: `/theme/${encodeURIComponent(item.permalink)}` })
      "
    >
      <div class="theme-wrap" :style="backgroundImageStyle(item)">
        <div class="overlay" />
        <div class="entry-content" @click.stop>
          <div class="text">
            <h3 class="title">{{ item.title }}</h3>
            <div class="meta">
              <div class="author">by {{ item.extensionAuthor }}</div>
            </div>
            <div class="action">
              <router-link
                btn="primary"
                :to="`/theme/${encodeURIComponent(item.permalink)}`"
              >
                Overview
              </router-link>
              <router-link
                v-if="item.demo"
                btn="default"
                :to="item.demo"
                target="_blank"
              >
                Demo
              </router-link>
            </div>
          </div>
          <div class="media">
            <img :src="item.icon" :alt="`${item.title} Logo`" class="logo" />
          </div>
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
    extensions: { type: Array, default: () => {} },
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
    getScreenshotsTall(this: any, item: FactorExtensionInfo): string[] {
      if (!item.screenshots) return []
      return item.screenshots.filter((_) => _.includes("tall"))
    },
    getPrimaryScreenshot(item: FactorExtensionInfo) {
      const screenshots = this.getScreenshotsTall(item)

      return screenshots[0] ?? ""
    },
  },
}
</script>

<style lang="less">
.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.grid-item-theme {
  display: block;
  transition: 0.29s var(--panel-movement);
  cursor: pointer;
  .theme-wrap {
    background-position: 50% 0%;
    background-size: cover;
    padding: 75% 0;

    position: relative;
    box-shadow: var(--panel-shadow);
    border-radius: 5px;
    overflow: hidden;
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 0;
      opacity: 0;
      transition: 0.3s cubic-bezier(0.52, 0.01, 0.16, 1);
    }
    .entry-content {
      z-index: 10;
      position: absolute;
      bottom: 0;
      transform: translateY(120%);
      transition: 0.3s cubic-bezier(0.52, 0.01, 0.16, 1);

      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      display: grid;
      grid-template-columns: 1fr 80px;
      grid-gap: 1rem;
      padding: 2rem;
      box-shadow: 0 -6px 14px 0 rgba(24, 32, 41, 0.06),
        0 0 0 1px rgba(0, 43, 93, 0.1), 0 -12px 34px 0 rgba(24, 32, 41, 0.04);
      .title {
        color: var(--color-text);
        font-weight: var(--font-weight-bold, 700);
        font-size: 1.6em;
      }
      .author {
        color: var(--color-text);
        opacity: 0.5;
      }
      .action {
        margin-top: 1rem;
        .ElButton {
          margin-right: 1rem;
        }
      }
      .media img {
        border-radius: 8px;
        width: 80px;
      }
    }
    &:hover {
      .overlay {
        opacity: 1;
      }
      .entry-content {
        transform: translateY(0%);
      }
    }
    @media (max-width: 900px) {
      padding: 80% 0 0;
      .entry-content {
        position: relative;
        transform: translateY(0%);
        .action {
          .btn-link + .btn-link {
            margin-top: 1rem;
          }
        }
      }
    }
  }
}
</style>
