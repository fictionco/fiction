<template>
  <div class="theme-grid">
    <factor-link v-for="(item, index) in 10" :key="index" path="#" class="grid-item-theme">
      <div class="theme-wrap" :style="backgroundImageStyle(index)">
        <div class="overlay" />
        <div class="entry-content">
          <div class="text">
            <h3 class="title">Theme Alpha</h3>
            <div class="meta">
              <div class="author">by Factor Inc.</div>
            </div>
            <div class="action">
              <factor-link btn="primary">Overview</factor-link>
              <factor-link btn="default">Demo</factor-link>
            </div>
          </div>
          <div class="media">
            <img src="./img/logo-alpha.svg" alt="Factor Alpha Logo" class="logo" />
          </div>
        </div>
      </div>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
    extensions: { type: Array, default: () => {} }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    setting,
    postLink,
    backgroundImageStyle(num: number) {
      const urls = [
        require("./img/screenshot-alpha.jpg"),
        require("./img/screenshot-zeno.jpg"),
        require("./img/screenshot-ultra.jpg")
      ]
      const r = num % 3
      const url = urls[r]

      return { backgroundImage: `url(${url})` }
    }
  }
})
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
  --panel-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
  display: block;
  transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

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
      box-shadow: 0 -6px 14px 0 rgba(24, 32, 41, 0.06), 0 0 0 1px rgba(0, 43, 93, 0.1),
        0 -12px 34px 0 rgba(24, 32, 41, 0.04);
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
        .factor-btn {
          margin-right: 1rem;
        }
      }
      .media img {
        border-radius: 8px;
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
      padding: 50% 0;
      .entry-content {
        transform: translateY(0%);
      }
    }
  }

  .entry-images {
    position: relative;
    max-width: 100%;
    img {
      max-width: 100%;
    }
    .screenshot {
      box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    }
    .logo {
      position: absolute;
      width: 200px;
      right: 1rem;
      bottom: -1rem;
      background: #fff;
      box-shadow: 0 5px 15px rgba(27, 34, 60, 0.1), 0 15px 35px rgba(27, 34, 60, 0.1),
        0 50px 100px rgba(27, 34, 60, 0.1), 20px -20px 35px rgba(80, 102, 119, 0.15);
      transform: perspective(1040px) rotate(2deg) rotateX(2deg) rotateY(-11deg)
        translateZ(-20px) scale(1);
    }
  }
}
</style>
