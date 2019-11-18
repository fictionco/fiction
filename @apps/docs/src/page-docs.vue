<template>
  <div class="page-docs">
    <section v-if="text" class="docs-wrap">
      <page-sidebar />

      <div class="mast">
        <div class="content">
          <div ref="scroller" class="scroller">
            <docs-entry ref="content" :text="text" />
            <docs-footer />
          </div>
        </div>
      </div>
    </section>
    <factor-error-404 v-else />
  </div>
</template>
<script>
import Vue from "vue"
import { getMarkdownHTML, metatags } from "./docs-handler"
import { factorError404 } from "@factor/ui"
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
      text: ""
    }
  },
  serverPrefetch() {
    // @ts-ignore
    return getMarkdownHTML(this.doc)
  },
  computed: {
    activeHash() {
      return this.$route.hash
    },
    doc() {
      return this.$route.params.doc || ""
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.path != from.path) {
        this.toggleNav(false)
        this.setContent()
      }
    }
  },
  async created() {
    if (!this.text) {
      await this.setContent()
    }
  },
  metaInfo() {
    return metatags(this.doc)
  },

  methods: {
    async setContent() {
      this.text = await getMarkdownHTML(this.doc)
    },
    toggleNav(v) {
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
  padding-top: 5em;
  .mast {
    padding: 0 1em;

    max-width: 1000px;
    margin: 0 auto;
  }

  .scroller {
    max-width: 700px;
    padding: 3em 0;
    padding-left: 50px;
    margin: 0 auto;
    @media (max-width: 1200px) {
      margin-left: 250px;
    }

    @media (max-width: 767px) {
      margin: 0 auto;
      padding: 3em 0;
    }
  }

  .docs-sidebar {
    @media (max-width: 767px) {
      display: none;
    }
  }

  // Mobile Nav
  .mobile-nav {
    display: block;
    &.toggle-nav {
      display: block;
    }
    @media (max-width: 960px) {
      display: none;
      position: fixed;
      width: 350px;
      padding: 1.5em;
      top: 0;
      bottom: 0;
      left: 0;
      min-height: 100vh;
      z-index: 100;

      overflow-y: scroll;
      background: #fff;
      box-shadow: var(--pane-shadow);
      // transform: translate3d(-100%, 0, 0);
      // transition: transform 0.1s ease-out;
      &.active {
        transform: translate3d(0, 0, 0);
      }
    }
  }
  .mobile-nav-toggle {
    display: none;
    cursor: pointer;
    font-weight: 800;
    margin-bottom: 20px;
    text-transform: uppercase;
    &:hover {
      color: var(--color-primary);
    }
    i {
      margin-right: 5px;
    }
    @media (max-width: 767px) {
      display: block;
    }
  }
}
</style>
