<template>
  <div class="page-docs">
    <section class="docs-wrap">
      <docs-sidebar />
      <div class="mast">
        <div class="content">
          <div v-formatted-text="getMarkdown()" />
          <docs-footer />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
//import Prism from "prismjs"
export default {
  components: {
    "docs-sidebar": () => import("#/el/el-docs-sidebar"),
    "docs-footer": () => import("#/el/el-docs-footer")
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
    "$route.fullPath": "hashChanged"
  },
  metatags() {
    return {
      title: "Introduction — Factor.js",
      description: "Factor.js - The Serverless Framework.",
      image: ""
    }
  },
  methods: {
    hashChanged(toPath, fromPath) {
      toPath = toPath.split("#")
      fromPath = fromPath.split("#")
      this.$nextTick(() => this.scrollTo(this.$route.hash))
    },
    scrolled() {
      var h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      var doc = document.documentElement
      var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      var el = this.contents.find(pos => {
        return pos > top + h / 2
      })
      this.current =
        (el ? this.contents.indexOf(el) : this.contents.length) - 1
    },
    scrollTo(id) {
      if (id !== this.$route.hash) {
        this.$router.push(this.$route.fullPath.split("#")[0] + id)
      }
      this.$nextTick(() => {
        var el = document.getElementById(id.slice(1))
        if (!el) return
        var to = el.offsetTop - 20
        var doc = document.documentElement
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        var diff = (to > top ? to - top : top - to) / 25
        var i = 0
        window.clearInterval(this.setInter)
        this.setInter = window.setInterval(() => {
          top = to > top ? top + diff : top - diff
          window.scrollTo(0, top)
          i++
          if (i === 25) {
            window.clearInterval(this.setInter)
          }
        }, 10)
      })
    },
    getMarkdown() {
      return require("./docs-v1/introduction.md")
    }
  }
}
</script>
<style lang="less">
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
    }
    h1 {
      margin: 0 0 1em;
    }
    h2 {
      margin: 45px 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
      padding-left: 20px;
      border-left: 4px solid var(--color-primary);
      p {
        font-weight: 800;
        padding-bottom: 0;
      }
    }
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
  }
}
</style>
