<template>
  <div class="nav-wrap">
    <div class="mobile-head" :class="{ active: showMobileMenu }" @click.stop>
      <site-brand class="mobile-brand" />
      <div class="mob-nav-btn">
        <div class="bars" @click="showMobileMenu = !showMobileMenu" />
      </div>
    </div>

    <div
      class="sidebar-wrap"
      :class="{ active: showMobileMenu }"
      @click="showMobileMenu = !showMobileMenu"
    >
      <div class="sidebar-brand-wrap">
        <site-brand class="site-brand" />
      </div>
      <nav v-if="siteNav">
        <template v-for="(item, index) in siteNav">
          <factor-link
            :key="index"
            :path="item.path"
            :target="item.target"
            class="nav-link text-gray-600 hover:text-gray-100"
            :class="[item._item, { 'nav-link-active': selected === item.path }]"
            @click="navItemPath(item.path)"
          >
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </nav>
      <div v-if="siteCopyright" v-formatted-text="siteCopyright + currentyear()" class="copyright" />
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api/settings"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    "site-brand": () => import("./el/brand.vue")
  },
  data() {
    return {
      loading: true,
      showMobileMenu: false,
      siteNav: setting("site.nav"),
      selected: "",
      siteCopyright: setting("site.copyright")
    }
  },
  mounted: function() {
    // Make sure intersection observer is available
    if (IntersectionObserver) {
      for (const ele of this.siteNav) {
        const observer = new IntersectionObserver(
          entries => {
            if (entries[0].isIntersecting) {
              this.selected = ele.path //`#${entries[0].target.id}`

              // Update browser url with visible div id as hashtag
              window.history.pushState(null, this.name, this.selected)
            }
          },
          { threshold: [0.2] }
        )
        if (document.querySelector(ele.path)) {
          observer.observe(document.querySelector(ele.path))
        }
      }
    }
  },
  methods: {
    setting,
    navItemPath(this: any, path: any) {
      const ele = document.querySelector(path)

      if (ele) {
        ele.scrollIntoView()
      }
    },
    currentyear(this: any) {
      return new Date().getFullYear()
    }
  }
})
</script>

<style lang="less">
.nav-wrap {
  .mobile-head {
    display: none;
    position: fixed;
    z-index: 50;
    justify-content: space-between;
    align-items: center;
    // height: auto;
    padding: 1em;
    width: 100%;
    background: var(--color-text);

    @media (max-width: 900px) {
      display: flex;
    }

    .mobile-brand {
      margin: 0 1rem;
    }

    .mob-nav-btn {
      .bars {
        display: none;
        cursor: pointer;
        position: relative;
        width: 30px;
        height: 30px;
        z-index: 9999999;

        &:hover {
          opacity: 0.7;
        }
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
          transition: 0.15s cubic-bezier(0.52, 0.01, 0.16, 1);
        }
        &:before {
          transform: rotate(0deg) translateY(-5px);
        }
        &:after {
          transform: rotate(0deg) translateY(5px);
        }
      }

      @media (max-width: 900px) {
        .bars {
          display: block;
        }
      }
    }

    // Active .mobile-head
    &.active {
      .mob-nav-btn {
        .bars {
          &:before {
            transform: rotate(45deg) translateY(0);
          }
          &:after {
            transform: rotate(-45deg) translateY(0);
          }
        }
      }
    }
  }
  .sidebar-wrap {
    position: fixed;
    font-family: var(--font-family-primary);
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    color: #f7f7f7;
    background: linear-gradient(90deg, #732b29 -100%, #101010 100%);
    background-color: #351a19;
    min-height: 100vh;
    height: auto;
    width: 280px;
    transition: 0.15s cubic-bezier(0.52, 0.01, 0.16, 1);
    transform: translate(0, 0);

    > div:last-child {
      display: flex;
      align-self: end;
      padding: 1rem 2rem;
    }

    nav {
      display: grid;
      align-items: center;
      padding: 0 2em;

      .nav-link {
        font-size: 1.4em;
        line-height: 1.2;
        text-decoration: none;
        min-height: 30px;
        transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

        &.nav-link-active {
          font-weight: var(--font-weight-semibold);
          color: #f6f6f6;
          span {
            position: relative;
            &:after {
              content: "";
              display: block;
              position: absolute;
              right: -54px;
              top: 50%;
              width: 40px;
              height: 3px;
              background: var(--color-primary);
            }
          }
        }
      }
    }

    .copyright {
      font-size: 0.8rem;
    }

    @media (max-width: 900px) {
      z-index: 90;
      transform: translate(-100%, 0);
      &.active {
        transform: translate(0, 0);
        overflow-x: hidden;
        overflow-y: scroll;
        box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>