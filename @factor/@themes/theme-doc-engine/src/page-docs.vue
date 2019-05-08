<template>
  <div class="page-docs">
    <section class="docs-wrap">
      <div class="docs-sidebar">
        <div ref="nav" class="sidebar-inner">
          <h2 class="title">Guide</h2>

          <ul class="menu-root">
            <li>
              <h3>Essentials</h3>
            </li>
            <li v-for="(item, itemIndex) in normalizedNav" :key="itemIndex">
              <factor-link :path="`/docs/${item.slug}`">{{ item.name }}</factor-link>
              <div v-if="item.slug == activePath">
                <li v-for="(h2, indexParent) in headers" :key="indexParent">
                  <a
                    class="nav-link parent"
                    :href="h2.anchor"
                    :class="$route.hash == h2.anchor ? 'active' : 'not'"
                    @click="clicked=true"
                  >{{ h2.text }}</a>
                  <ul v-if="h2.sub.length">
                    <li v-for="(h3, indexSub) in h2.sub" :key="indexSub">
                      <a
                        class="nav-link sub"
                        :class="$route.hash == h3.anchor ? 'active' : 'not'"
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
          <div ref="content" v-formatted-text="getMarkdown()" />
          <docs-footer />
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { setTimeout } from "timers"
export default {
  components: {
    "docs-footer": () => import("./el/el-docs-footer")
  },
  data() {
    return {
      loading: true,
      nav: [],
      headers: [],
      allHeaders: [],
      clicked: false
    }
  },
  computed: {
    docsPage() {
      return this.$route.params.markdownurl || "introduction"
    },
    normalizedNav() {
      return this.navItems().map(_ => {
        if (typeof _ == "string") {
          return {
            slug: _,
            name: this.$utils.toLabel(_)
          }
        } else {
          return _
        }
      })
    },
    activePath() {
      return this.$route.params.markdownurl || ""
    }
  },
  watch: {
    $route: function() {
      this.setPage()
    }
  },
  metatags() {
    return {
      title: "Introduction — Factor.js",
      description: "Factor.js - The Serverless Framework.",
      image: ""
    }
  },
  mounted() {
    this.prism = require("prismjs")

    this.setPage()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll())
  },
  methods: {
    navItems() {
      const nav = [
        "installation",
        {
          name: "Introduction",
          slug: ""
        },
        "directory-structure",
        "configuration",
        "routing",
        "views",
        "async-data",
        "assets",
        "plugins",
        "modules",
        {
          name: "Commands and Deployment",
          slug: "commands"
        },
        "development-tools"
      ]

      return nav
    },
    getMarkdown() {
      let filename = this.docsPage
      return require(`./docs-v1/${filename}.md`)
    },
    setPage() {
      // wait til content is done rendering
      setTimeout(() => {
        this.prism.highlightAll()
      }, 50)

      // Make sure new content is loaded before scanning for h2, h3
      this.$nextTick(() => {
        this.headers = this.getHeaders(this.$refs.content)
        window.addEventListener("scroll", this.onScroll())
      })
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
          this.$router.replace({
            hash: decodeURIComponent(anchor.id),
            meta: { noscroll: true }
          })
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
        .replace(/\(.*\)$/, "")

      return text
    }
  }
}
</script>

<style lang="less">
@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/themes/prism.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/plugins/line-numbers/prism-line-numbers.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/plugins/line-highlight/prism-line-highlight.min.css");

.page-docs {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .docs-wrap {
    h1 {
      font-size: 2em;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.2em;
      margin: 1em 0;
    }
    h1,
    h2,
    h3 {
      font-weight: 800;
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
    &.open {
      transform: translate(0, 0);
    }
    .sidebar-inner {
      width: 340px;
      padding: 40px 20px 60px 60px;
    }
    @media (max-width: 767px) {
      z-index: 10;
      top: 0;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
      transform: translate(-340px, 0);
      .sidebar-inner {
        width: 290px;
        padding: 30px;
      }
    }
    // All Lists
    ul {
      line-height: 1.6em;
      list-style: none;
      li {
        margin-top: 0.5em;
      }
    }
    // sidebar main menu
    ul.menu-root {
      padding-left: 0;
      a {
        color: inherit;
        &.router-link-exact-active {
          color: var(--color-primary);
          font-weight: 800;
        }
        &:hover {
          border-bottom: 2px solid var(--color-primary);
        }
      }
      //sidebar
      .nav-link {
        font-size: 0.85em;
        margin-left: 1em;
      }
    }
  }
  // Docs Content
  .content {
    margin: 0 auto;
    max-width: 700px;
    padding: 3em 0 3em 3.125em;
    @media (max-width: 1300px) {
      margin-left: 290px;
    }
    @media (max-width: 767px) {
      margin: 0 auto;
      padding: 3em 0;
    }
    h1,
    h2,
    h3 {
      position: relative;
      a {
        pointer-events: auto;
        color: inherit;
      }
    }
    h1 {
      margin: 0 0 1em;
    }
    h2 {
      margin: 45px 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    h3 {
      position: relative;
      &:before {
        content: "#";
        color: var(--color-primary);
        position: absolute;
        left: -0.9em;
        margin-top: -0.15em;
        font-size: 1.2em;
        font-weight: 800;
      }
    }
    a {
      color: var(--color-primary);
    }
    img {
      max-width: 100%;
    }
    p,
    ul,
    ol {
      line-height: 1.6em;
      padding-bottom: 1.2em;
    }
    ol,
    ul {
      padding-left: 1.5em;
    }
    blockquote {
      margin: 2em 0;
      padding: 10px 10px 10px 20px;
      background: #f8f8f8;
      border-left: 4px solid var(--color-primary);
      p {
        padding-bottom: 0;
      }
    }
    .alert {
      color: var(--color-light);
      background-color: var(--color-bg-dark);
      padding: 15px 15px 0;
      line-height: 20px;
      margin: 20px 0;
      border-radius: 4px;
      code {
        background-color: rgba(255, 255, 255, 0.1);
      }
      a {
        color: var(--color-light);
        text-decoration: underline;
      }
    }
    pre {
      max-width: 100%;
      overflow-x: scroll;
      margin-bottom: 1em;
    }
    // code {
    //   padding: 2px 7px;
    //   background: #f8f8f8;
    // }
    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    p.tip {
      padding: 12px 24px 12px 30px;
      margin: 2em 0;
      border-left: 4px solid var(--color-primary);
      background-color: #fff;
      border-radius: 0 4px 4px 0;
    }
    sub,
    sup {
      position: relative;
      font-size: 75%;
      line-height: 0;
      vertical-align: baseline;
    }
    sub {
      top: -0.5em;
    }
    sup {
      bottom: -0.25em;
    }
    table {
      margin-bottom: 1em;
      border-spacing: 0;

      thead tr th {
        background: #f8f8f8;
        padding: 10px 15px;
        text-transform: uppercase;
      }
      th,
      td {
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      td {
        padding: 10px;
      }
    }
  }
}
</style>
