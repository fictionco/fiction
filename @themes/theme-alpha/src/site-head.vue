<template>
  <div class="site-head blue">
    <div class="site-head-pad">
      <site-brand />
      <div
        class="nav-wrap"
        :class="{ active: showMobileMenu }"
        @click="showMobileMenu = !showMobileMenu"
      >
        <div class="nav">
          <template v-for="(item, index) in setting('site.nav')">
            <factor-link :key="index" :path="item.path">
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span>{{ item.name }}</span>
            </factor-link>
          </template>
        </div>
        <div class="social">
          <template v-for="(item, index) in setting('site.social')">
            <factor-link
              :key="index"
              :path="item.path"
              class="factor-icon"
              target="_blank"
            >
              <factor-icon v-if="item.icon" :icon="item.icon" />
            </factor-link>
          </template>
        </div>
      </div>
      <div class="mob-nav-btn">
        <div
          :class="{ active: showMobileMenu }"
          @click="showMobileMenu = !showMobileMenu"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "site-brand": () => import("./el/brand.vue")
  },
  data() {
    return {
      showMobileMenu: false
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.site-head {
  position: relative;
  z-index: 10;
  padding: 0 1.5em;
  background: var(--color-primary, #1a49bd);
  color: var(--color-white);
}

.site-head-pad {
  height: 75px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .brand {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .mob-nav-btn {
    div {
      cursor: pointer;
      position: relative;
      display: none;
      width: 30px;
      height: 30px;
      &:before,
      &:after {
        cursor: pointer;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        left: 0;
        top: 50%;
        margin-top: -1px;
        background-color: var(--color-white, #ffffff);
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      }
      &:before {
        transform: rotate(0deg) translateY(-5px);
      }
      &:after {
        transform: rotate(0deg) translateY(5px);
      }
    }

    @media (max-width: 767px) {
      div {
        display: block;
        z-index: 210;
      }

      div.active {
        &:before,
        &:after {
          cursor: pointer;
          background-color: var(--color-text, #303030);
        }
        &:before {
          transform: rotate(45deg) translateY(0);
        }
        &:after {
          transform: rotate(-45deg) translateY(0);
        }
      }
    }
  }
  .nav-wrap {
    flex: 3;
    display: grid;
    grid-template-columns: 2fr 1fr;
    @media (max-width: 767px) {
      opacity: 0;
      pointer-events: none;
      &.active {
        opacity: 1;
        pointer-events: auto;
      }
      grid-template-columns: 1fr;
      position: fixed;
      align-items: center;
      z-index: 200;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 14px solid var(--color-primary, #1a49bd);
      background-color: var(--color-white);
      transition: 0.55s cubic-bezier(0.52, 0.01, 0.16, 1);
    }
  }

  .nav,
  .social {
    > a {
      letter-spacing: 0.08em;
      font-size: 0.9em;
      font-weight: 300;
      color: #fdfdfd;
      margin: 0 0.5em;
      &:hover,
      &.active,
      &.active-path {
        color: var(--color-tertiary);
        @media (max-width: 767px) {
          color: var(--color-primary, #1a49bd);
        }
      }
      @media (max-width: 767px) {
        font-size: 1.2em;
        color: var(--color-text, #303030);
        text-align: center;
        padding: 1.5em 0;
        &:hover,
        &.active {
          color: var(--color-primary, #1a49bd);
        }
        &:active {
          color: var(--color-primary, #1a49bd);
        }
      }
    }
  }

  .nav {
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    @media (max-width: 767px) {
      display: grid;
    }
  }
  .social {
    text-align: right;
    @media (max-width: 767px) {
      text-align: center;
      justify-content: center;
    }
  }
}
</style>
