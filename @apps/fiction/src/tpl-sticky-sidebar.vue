<template>
  <div class="page sidebar-page">
    <div class="grid-sidebar">
      <factor-loading-ring v-if="loading" />
      <div v-else ref="nav" class="page-nav">
        <div v-formatted-text="post.title" class="nav-title" />
        <ul>
          <li v-for="(h2, indexParent) in headers" :key="indexParent">
            <a
              class="nav-link parent"
              :href="h2.anchor"
              :class="$route.hash == h2.anchor ? 'active' : 'not'"
              @click="clicked = true"
              >{{ h2.text }}</a
            >
            <ul v-if="h2.sub.length">
              <li v-for="(h3, indexSub) in h2.sub" :key="indexSub">
                <a
                  class="nav-link sub"
                  :class="$route.hash == h3.anchor ? 'active' : 'not'"
                  :href="h3.anchor"
                  @click="clicked = true"
                  >{{ h3.text }}</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div ref="scroller" class="grid-content">
      <div ref="content" class="entry-content">
        <div v-if="post.title" class="title">
          <h1 v-formatted-text="post.title" />
          <factor-post-edit :post-id="post._id" />
        </div>
        <div class="admin-items">
          <div class="date">Updated &mdash; {{ standardDate(post.date) }}</div>
        </div>
        <div v-formatted-text="renderMarkdown(post.content)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { factorPostEdit } from "@factor/post"
import { renderMarkdown } from "@factor/api/markdown"
import { throttle, standardDate } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLoadingRing, factorPostEdit },
  props: {
    post: { type: Object, default: () => {} },
  },
  data() {
    return {
      loading: true,
      content: "",
      headers: [],
      allHeaders: [],
      navFixed: false,
      clicked: false,
    }
  },
  watch: {
    $route: function () {
      this.setNav()
    },
  },

  mounted() {
    this.setNav()
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll())
  },
  methods: {
    standardDate,
    renderMarkdown,
    setNav() {
      this.headers = this.getHeaders(this.$refs.content)

      window.addEventListener("scroll", this.onScroll())
    },
    onScroll() {
      return throttle(() => {
        this.setActiveHash()
      }, 100)
    },
    setActiveHash() {
      // Disable this behavior after click actions (not actual scrolls)
      if (this.clicked || !this.$refs.scroller) {
        this.clicked = false
        return
      }
      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )

      const anchors = this.$refs.scroller.querySelectorAll("h2, h3")

      for (const [i, anchor] of anchors.entries()) {
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
            meta: { noscroll: true },
          })
          return
        }
      }
    },
    getHeaders(el) {
      const out = []
      el.querySelectorAll("h2").forEach((h2) => {
        this.allHeaders.push(h2)
        const sub = this.collectH3s(h2).map((h3) => {
          this.allHeaders.push(h3)
          return {
            text: this.getHeaderText(h3),
            anchor: `#${h3.id}`,
          }
        })
        out.push({
          text: this.getHeaderText(h2),
          anchor: `#${h2.id}`,
          sub,
        })
      })
      this.loading = false
      return out
    },
    collectH3s(h) {
      const h3s = []
      let next = h.nextSibling
      while (next && next.tagName !== "H2") {
        if (next.tagName === "H3") {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    },
    getHeaderText(h) {
      const text = [].slice
        .call(h.childNodes)
        .map(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue
          } else if (["CODE", "SPAN"].includes(node.tagName)) {
            return node.textContent
          } else {
            return ""
          }
        })
        .join("")
        .replace(/\(.*\)$/, "")

      return text
    },
  },
})
</script>

<style lang="less">
.sidebar-page {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 1.5em;
  max-width: 1200px;
  margin: 0 auto;
  .grid-sidebar {
    .loading-ring-wrap {
      margin: 3em 0;
    }
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    .grid-sidebar {
      display: none;
    }
  }
  .page-nav,
  .entry-content {
    padding: 3rem 1.5rem;
  }
  .page-nav {
    font-size: 0.85em;

    position: sticky;
    max-height: 80vh;
    overflow: scroll;
    top: 0;
    .nav-title {
      font-weight: 600;
      margin-bottom: 0.5em;
      font-size: 1.2em;
    }
    ul {
      padding: 0;
      margin: 0;
      list-style-type: none;
      ul {
        padding-left: 1rem;
        font-size: 0.95em;
      }
    }

    .nav-link {
      font-size: 1em;
      font-weight: 400;
      display: inline-block;
      color: inherit;

      padding: 0.2em 0;
      line-height: 1.4;
      width: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      &.active {
        font-weight: 600;
        color: #0496ff;
      }
      &:hover {
        color: #0496ff;
      }
      &:active {
        color: #ff0076;
      }
    }
  }
  .entry-content {
    max-width: 650px;
    .title {
      border-bottom: 1px dotted rgba(0, 0, 0, 0.07);
      margin-bottom: 1em;
      padding: 0.75em 0;
      letter-spacing: -0.02em;

      display: flex;
      justify-content: space-between;
      h1 {
        font-size: 1.5em;
        font-weight: var(--font-weight-bold);
      }
    }
    .admin-items {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1em;
      font-weight: 600;
    }
  }
}
</style>
