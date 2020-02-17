<template>
  <header class="site-head">
    <div class="site-head-pad">
      <site-brand />
      <div
        class="nav-wrap"
        :class="{ active: showMobileMenu }"
        @click="showMobileMenu = !showMobileMenu"
      >
        <div v-if="siteNav" class="nav">
          <template v-for="(item, index) in siteNav">
            <factor-link :key="index" :path="item.path">
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span>{{ item.name }}</span>
            </factor-link>
          </template>
        </div>
        <div v-if="siteSocial" class="social">
          <template v-for="(item, index) in siteSocial">
            <factor-link :key="index" :path="item.path" class="factor-icon" target="_blank">
              <factor-icon v-if="item.icon" :icon="item.icon" />
            </factor-link>
          </template>
        </div>
      </div>
      <div class="mob-nav-btn">
        <div :class="{ active: showMobileMenu }" @click="showMobileMenu = !showMobileMenu" />
      </div>
    </div>
  </header>
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
      showMobileMenu: false,
      siteNav: setting("site.nav"),
      siteSocial: setting("site.social")
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
  background: var(--color-bg-dark);
  color: #fff;
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
        background-color: #ffffff;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      }
      &:before {
        transform: rotate(0deg) translateY(-5px);
      }
      &:after {
        transform: rotate(0deg) translateY(5px);
      }
      &.active {
        position: fixed;
        top: 1.5em;
        right: 1.5em;
        z-index: 9999999;
      }
    }

    @media (max-width: 900px) {
      div {
        display: block;
        z-index: 210;
      }

      div.active {
        &:before,
        &:after {
          cursor: pointer;
          background-color: var(--color-text);
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
    @media (max-width: 900px) {
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
      border: 14px solid var(--color-primary-dark);
      background-color: #fff;
      transition: 0.55s cubic-bezier(0.52, 0.01, 0.16, 1);
    }
  }

  .nav,
  .social {
    > a {
      color: #99adc0;
      padding: 0 0.6em;

      &:hover,
      &.active,
      &.active-path {
        color: var(--color-primary);
        @media (max-width: 900px) {
          color: var(--color-primary);
        }
      }
      @media (max-width: 900px) {
        font-size: 1.4em;
        color: var(--color-text);
        text-align: center;
        padding: 1.5em 0.5em;
        &:hover,
        &.active {
          color: var(--color-primary);
        }
        &:active {
          color: var(--color-primary);
        }
      }
    }
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1em;

    @media (max-width: 900px) {
      display: grid;
    }
  }
  .social {
    text-align: right;
    a {
      font-size: 1.2em;
    }
    @media (max-width: 900px) {
      text-align: center;
      justify-content: center;
      a {
        font-size: 1.6em;
      }
    }
  }
}
</style>
