<template>
  <div class="slider-plugin-container">
    <section if="extensions.length > 0" class="slider-plugin">
      <header class="section-header">
        <h1 class="title">{{ title }}</h1>
      </header>
      <div class="carousel">
        <div
          v-for="(item, index) in extensions"
          :key="item.packageName"
          class="featured-item-plugin"
          :class="{ active: isActive(index) }"
          @click="
            $router.push({
              path: `/plugin/${encodeURIComponent(item.path)}`,
            })
          "
        >
          <div class="entry-content">
            <img :src="item.icon" :alt="`${item.title} Icon`" class="icon" />
            <h3 class="title">
              {{ item.title }}
              <span v-if="item.pro" class="pro-badge">Pro</span>
            </h3>
            <p class="description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>
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
    return {
      loading: false,
      active: 0,
      totalActive: 3,
      timer: null,
      animationInterval: 2000,
    }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    currentExtension: function (this: any) {
      return this.extensions[Math.abs(this.active) % this.extensions.length]
    },
    activeSlide(this: any) {
      return this.extensions[this.active]
    },
  },
  mounted() {
    this.runTimer()
  },
  methods: {
    isActive(this: any, index: number) {
      const active = this.active
      const totalActive = this.totalActive
      const numberExtensions = this.extensions.length

      const endRange = active + totalActive

      const startRange =
        endRange > numberExtensions ? endRange - numberExtensions - 1 : -1

      return (index >= active && index < active + totalActive) ||
        index <= startRange
        ? true
        : false
    },
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
    nextSlide(this: any) {
      if (this.active == this.extensions.length - 1) {
        this.active = 0
      } else {
        this.active++
      }

      this.runTimer()
    },
    runTimer(this: any) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.nextSlide(), this.animationInterval)
    },
  },
}
</script>

<style lang="less">
.slider-plugin-container {
  .slider-plugin {
    position: relative;

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
  }

  .carousel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .featured-item-plugin {
    // display: grid;
    // grid-template-columns: 1fr 2fr;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
    grid-gap: 2rem;
    align-items: center;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    box-shadow: var(--panel-shadow);
    cursor: pointer;
    display: none;
    opacity: 0;

    &.active {
      display: grid;
      animation: opacity 0.4s forwards;
    }

    @keyframes opacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .entry-media {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 0%;
      position: relative;
      max-width: 100%;
      position: relative;

      box-shadow: 1px 0 0 rgba(50, 50, 93, 0.13);
      &.icon {
        background-size: contain;
      }
      img {
        width: 100%;
      }
    }

    .entry-content {
      padding: 2rem 1.5rem;
      .icon {
        display: block;
        width: 64px;
        height: 64px;
        border-radius: 0.5rem;
        box-shadow: 0 2.5px 5px -1px rgba(50, 50, 93, 0.25),
          0 1.5px 3px -1.5px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        margin-bottom: 1rem;
      }
      .title {
        display: inline-flex;
        align-items: center;
        color: var(--color-text);
        font-weight: var(--font-weight-bold, 700);
        font-size: 1.6em;
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
        font-size: 1.2em;
        color: var(--color-text);
        opacity: 0.5;
        // Unofficial line clamp works on all major browsers except IE
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
        .likes {
          display: inline-flex;
          align-items: center;
          img {
            margin-right: 0.3rem;
          }
        }
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
