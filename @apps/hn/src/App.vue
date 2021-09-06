<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <div class="home">
          <router-link to="/" exact>
            <ElemLogo class="h-6"></ElemLogo>
          </router-link>
        </div>
        <div class="nav">
          <router-link to="/v/top">Top</router-link>
          <router-link to="/v/new">New</router-link>
          <router-link to="/v/show">Show</router-link>
          <router-link to="/v/ask">Ask</router-link>
          <router-link to="/v/job">Jobs</router-link>
        </div>
        <div class="alt">
          <a
            class="github"
            href="https://github.com/fiction-com/factor-hacker-news"
            target="_blank"
            rel="noopener"
          >
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            class="github"
            href="https://www.factor.so"
            target="_blank"
            rel="noopener"
            >Built with FactorJS</a
          >
        </div>
      </nav>
    </header>

    <router-view v-slot="{ Component }" class="view">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import ElemLogo from "./el/ElemLogo.vue"
import { useMeta } from "@factor/api"

useMeta({
  title: "FactorJS Hacker News",
})
</script>

<style lang="less">
// Set site wide CSS variables
// Many of these are standard and used by plugins/themes also
html {
  --color-text: #34495e;
  --color-primary: #f60;
  --font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-family: var(--font-family-primary);
  --font-weight-normal: 500;
  --font-weight-bold: 700;
  --color-bg: #ffffff;
  --color-border: #eee;
  font-size: 16px; // 1rem
  font-weight: var(--font-weight-normal);
  background-color: var(--color-bg);
  margin: 0;
  padding-top: 55px;
  color: var(--color-text);
  overflow-y: scroll;

  a {
    color: #34495e;
    text-decoration: none;
  }

  .header {
    background-color: var(--color-primary);
    position: fixed;
    z-index: 999;

    top: 0;
    left: 0;
    right: 0;
    font-weight: var(--font-weight-semibold, 600);
    .inner {
      max-width: 800px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px auto;
      padding: 12px 5px;
    }

    a {
      svg.logo {
        width: 1.5rem;
        height: 1.5rem;
        transform: translate(-0.1rem, -0.1rem);
      }
      color: rgb(255, 212, 158);
      line-height: 1.5em;
      transition: color 0.15s ease;
      display: inline-block;
      vertical-align: middle;

      margin-right: 1.8em;
      border-radius: 5px;
      padding: 0.2rem 0.5rem;
      &:hover,
      &.router-link-active {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &:nth-child(6) {
        margin-right: 0;
      }
    }

    .github {
      color: #fff;
      margin: 0;
      float: right;
    }
  }

  .logo {
    display: inline-block;
    vertical-align: middle;
  }

  .view {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  @media (max-width: 860px) {
    .header .inner {
      padding: 15px 30px;
    }
  }

  @media (max-width: 600px) {
    .header {
      .inner {
        padding: 8px;
      }

      a {
        margin-right: 0.25rem;
        padding: 0.1rem 0.5rem;
      }

      .github {
        display: none;
      }
    }
    .news-view {
      padding-top: 0;
    }
    .news-list-nav {
      top: 0;
      position: relative;
    }
  }
}
</style>
