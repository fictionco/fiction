<template>
  <div class="page-docs">
    <section v-if="docHtml" class="docs-wrap">
      <page-sidebar />

      <div class="mast">
        <div class="content">
          <div ref="scroller" class="scroller">
            <docs-entry ref="content" :text="docHtml" />
            <docs-footer />
          </div>
        </div>
      </div>
    </section>
    <factor-error-404 v-else />
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { factorError404 } from "@factor/ui"
import { storeItem, stored } from "@factor/api"
import { Route } from "vue-router"
import { getMarkdownHTML, metatags } from "./docs-handler"
export default Vue.extend({
  components: {
    factorError404,
    "page-sidebar": () => import("./sidebar.vue"),
    "docs-footer": () => import("./el/el-docs-footer.vue"),
    "docs-entry": () => import("./el/entry.vue")
  },
  data() {
    return {
      loading: true,
      toggle: true,
      clicked: false,
      html: ""
    }
  },
  async serverPrefetch() {
    return await this.setContent()
  },
  computed: {
    docHtml(this: any) {
      return stored(this.storeKey)
    },
    activeHash(this: any) {
      return this.$route.hash
    },
    doc(this: any) {
      return this.$route.params.doc || ""
    },
    storeKey() {
      return this.doc || "docsHome"
    }
  },
  watch: {
    $route: function(this: any, to: Route, from: Route) {
      if (to.path != from.path) {
        this.toggleNav(false)
        this.setContent()
      }
    }
  },
  mounted() {
    if (!this.docHtml) {
      this.setContent()
    }
  },
  metaInfo() {
    return metatags(this.doc)
  },

  methods: {
    async setContent(this: any) {
      const html = await getMarkdownHTML(this.doc)

      storeItem(this.storeKey, html)
    },
    toggleNav(this: any, v?: boolean) {
      if (typeof v == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = v
      }

      this.clickHandler = () => {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
})
</script>

<style lang="less">
.page-docs {
  padding: 4rem 1rem 1rem;
  font-size: 1.2em;
  .docs-wrap {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(250px, 300px) minmax(500px, 750px);
    grid-gap: 5rem;
  }
  .mast {
    min-width: 0;
  }

  .scroller {
    padding: 3em 0;
    margin: 0 auto;
  }

  .docs-entry {
  }

  @media (max-width: 900px) {
    .docs-wrap {
      grid-template-columns: 1fr;
    }
    .scroller {
      margin: 0 auto;
      padding: 0;
    }
    .docs-sidebar {
      display: none;
    }
  }

  // Mobile Nav
  // .mobile-nav {
  //   display: block;
  //   &.toggle-nav {
  //     display: block;
  //   }
  //   @media (max-width: 960px) {
  //     display: none;
  //     position: fixed;
  //     width: 350px;
  //     padding: 1.5em;
  //     top: 0;
  //     bottom: 0;
  //     left: 0;
  //     min-height: 100vh;
  //     z-index: 100;

  //     overflow-y: scroll;
  //     background: #fff;
  //     box-shadow: var(--pane-shadow);
  //     // transform: translate3d(-100%, 0, 0);
  //     // transition: transform 0.1s ease-out;
  //     &.active {
  //       transform: translate3d(0, 0, 0);
  //     }
  //   }
  // }
  // .mobile-nav-toggle {
  //   display: none;
  //   cursor: pointer;
  //   font-weight: 800;
  //   margin-bottom: 20px;
  //   text-transform: uppercase;
  //   &:hover {
  //     color: var(--color-primary);
  //   }
  //   i {
  //     margin-right: 5px;
  //   }
  //   @media (max-width: 767px) {
  //     display: block;
  //   }
  // }
}
</style>
