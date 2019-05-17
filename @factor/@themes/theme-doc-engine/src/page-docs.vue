<template>
  <div class="page-docs">
    <section class="docs-wrap">
      <!-- <div v-if="toggle" class="mobile-nav" :class="toggle ? 'toggle-nav' : 'toggle-main'">
         <p>Nav Toggle Placeholder - need to make sidebar nav component to add here</p>
      </div>-->

      <div class="docs-sidebar" @click.stop>
        <div ref="nav" class="sidebar-inner">
          <h2 class="title">Guide</h2>

          <ul class="menu-root">
            <li v-for="(item, itemIndex) in nav" :key="itemIndex" class="doc-menu">
              <factor-link
                class="primary-doc-link"
                :path="`/docs/${item.permalink}`"
              >{{ item.name }}</factor-link>
              <div v-if="item.permalink == activePath" class="scroll-menu">
                <li v-for="(h2, indexParent) in headers" :key="indexParent">
                  <a
                    class="nav-link parent"
                    :href="h2.anchor"
                    :class="activeHash == h2.anchor ? 'scroll-active' : ''"
                    @click="clicked=true"
                  >{{ h2.text }}</a>
                  <ul v-if="h2.sub.length">
                    <li v-for="(h3, indexSub) in h2.sub" :key="indexSub">
                      <a
                        class="nav-link sub"
                        :class="activeHash == h3.anchor ? 'scroll-active' : `not-${h3.anchor}`"
                        :href="h3.anchor"
                        @click="clicked=true"
                      >{{ h3.text }}</a>
                    </li>
                  </ul>
                </li>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="mast">
        <div class="content">
          <div class="mobile-nav-toggle-wrap" @click.stop>
            <div class="mobile-nav-toggle" @click="toggleNav()">
              <factor-icon icon="bars" />Menu
            </div>
          </div>
          <div ref="scroller" class="scroller">
            <docs-entry ref="content" :text="outline.getMarkdownHTML(doc)" />
            <docs-footer />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import outline from "../docs/outline"
export default {
  components: {
    "docs-footer": () => import("./el/el-docs-footer"),
    "docs-entry": () => import("./el/entry")
  },
  data() {
    return {
      loading: true,
      activeRoute: this.$route.path,
      activeHash: this.$route.hash,
      toggle: true,

      headers: [],
      allHeaders: [],
      clicked: false,
      outline: outline(this)
    }
  },
  computed: {
    doc() {
      return this.$route.params.markdownurl || ""
    },

    activePath() {
      return this.$route.params.markdownurl || ""
    },
    nav() {
      return this.outline.config()
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.path != from.path) {
        this.activeRoute = to.path
        this.toggleNav(false)
        this.setPage()
      }
    }
  },
  metatags() {
    const { title, description } = this.outline.selected(this.doc)
    return { title, description }
  },

  mounted() {
    this.setPage()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll())
  },
  methods: {
    socialImage(post) {
      return post.featuredImage
        ? post.featuredImage[0].url
        : post.images
        ? post.images[0].url
        : ""
    },
    toggleNav(v) {
      if (typeof v == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = v
      }

      this.clickHandler = e => {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      };

      if (this.toggle) {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    },

    setPage() {
      // Make sure new content is loaded before scanning for h2, h3
      setTimeout(() => {
        this.headers = this.getHeaders(this.$refs.scroller)

        window.addEventListener("scroll", this.onScroll())
      }, 50)
    },
    onScroll() {
      return this.$lodash.throttle(() => {
        this.setActiveHash()
      }, 100)
    },
    setActiveHash() {
      // Disable this behavior after click actions (not actual scrolls)
      if (this.clicked || !this.$refs.scroller) {
        this.clicked = false
        return;
      }

      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )

      const anchors = this.$refs.scroller.querySelectorAll("h2, h3")

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i]
        const nextAnchor = anchors[i + 1]

        const isActive =
          (i === 0 && scrollTop === 0) ||
          (scrollTop >= anchor.offsetTop + 10 &&
            (!nextAnchor || scrollTop < nextAnchor.offsetTop - 10))

        if (
          isActive &&
          decodeURIComponent(this.$route.hash) !== decodeURIComponent(anchor.id)
        ) {
          this.activeHash = `#${anchor.id}`
          // this.$router.replace({
          //   hash: decodeURIComponent(anchor.id),
          //   meta: { noscroll: true }
          // })
          return;
        }
      }
    },
    getHeaders(el) {
      const out = []
      el.querySelectorAll("h2").forEach(h2 => {
        this.allHeaders.push(h2)
        const sub = this.collectH3s(h2).map(h3 => {
          this.allHeaders.push(h3)
          return {
            text: this.getHeaderText(h3),
            anchor: `#${h3.id}`
          }
        })
        out.push({
          text: this.getHeaderText(h2),
          anchor: `#${h2.id}`,
          sub
        })
      })
      this.loading = false
      return out
    },
    collectH3s(h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== "H2") {
        if (next.tagName === "H3") {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    },
    getHeaderText(h) {
      var text = [].slice
        .call(h.childNodes)
        .map(function(node) {
          return node.textContent
          if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue
          } else if (["CODE", "SPAN"].indexOf(node.tagName) !== -1) {
            return node.textContent
          } else {
            return ""
          }
        })
        .join("")

      return text
    }
  }
}
</script>

<style lang="less">
.page-docs {
  .mast {
    padding: 0 2em;

    max-width: 1000px;
    margin: 0 auto;
  }

  .scroller {
    max-width: 750px;
    padding: 3em 0;
    padding-left: 50px;
    margin: 0 auto;
    @media (max-width: 1300px) {
      margin-left: 290px;
    }
    @media (max-width: 767px) {
      margin: 0 auto;
      padding: 3em 0;
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

  // Docs Sidebar
  .docs-sidebar {
    position: fixed;
    top: 45px;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100vh;
    padding-bottom: 5em;
    .title {
      font-size: 1.3em;
      font-weight: 800;
      margin-bottom: 1em;
    }
    @media (max-width: 767px) {
      display: block;
      z-index: 10;
      top: 0;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
      transform: translate(0, 0);
    }

    .sidebar-inner {
      width: 340px;
      padding: 40px 20px 60px 60px;
    }

    ul {
      line-height: 1.6em;
      list-style: none;
      li.doc-menu {
        margin-top: 0.5em;
      }
    }
    // sidebar main menu
    ul.menu-root {
      padding-left: 0;
      .primary-doc-link {
        font-weight: 600;
      }
      a {
        color: inherit;
        &.router-link-exact-active,
        &:hover,
        &.scroll-active {
          color: var(--color-primary);
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        &:hover {
          //border-bottom: 2px solid var(--color-primary);
        }
      }
      //sidebar
      .nav-link {
        font-size: 0.85em;
        margin-left: 1em;
        font-weight: 400;
        &.sub {
          margin-left: 1.5em;
          font-size: 0.8em;
        }
      }
      .scroll-menu {
        padding: 0.25em 0 0.5em;
      }
    }
  }
}
</style>
