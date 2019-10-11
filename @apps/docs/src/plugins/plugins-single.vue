<template>
  <div class="plugins-container-single">
    <!-- <div v-if="!$lodash.isEmpty(post)"> -->

    <widget-header :image="post.image" :title="post.title">
      <div slot="subtitle">
        <span v-if="post.author">by {{ post.author }}</span>
        <span v-if="post.categories">in{{ post.categories }}</span>
        <span v-if="post.downloads">{{ post.downloads }} Downloads</span>
      </div>
    </widget-header>

    <div class="plugins-wrap content-pad">
      <div class="content">
        <factor-link class="back" :path="$setting.get('plugins.indexRoute')">
          <factor-icon icon="arrow-left" />
          <span>{{ returnLinkText }}</span>
        </factor-link>
        <p>Text: {{ post.text }}</p>
        <div>
          <div v-formatted-text="getReadme" class="plugin-formated-text" />
        </div>
        <!-- <pre>
        {{ post }}
        </pre>-->
      </div>
      <div class="sidebar">
        <plugins-sidebar />
      </div>
    </div>
  </div>
</template>
<script>
import getPlugins from "./json/entries"

export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "plugins-sidebar": () => import("./plugins-sidebar")
  },
  data() {
    return {
      entriesJSON: getPlugins
    }
  },
  computed: {
    returnLinkText() {
      return this.$setting.get("plugins.returnLinkText") || "All Plugins Here"
    },
    post() {
      // All Posts
      let entries = this.entriesJSON.entries

      // Page Slug
      let pageSlug = this.$route.params.permalink

      // Find post with same page slug
      let post = entries.find(entry => entry.permalink === pageSlug)

      return post
    },
    getReadme() {
      //let markdownFile = this.post.content
      let markdownContent = require(`${this.post.content}`)

      return markdownContent
        ? this.$markdown.render(markdownContent, { variables: true })
        : ""
    }
  },
  mounted() {
    require("../prism/prism.js")

    this.prism = window.Prism
  },
  metaInfo() {
    return {
      title: this.$post.titleTag(this.post._id),
      description: this.$post.descriptionTag(this.post._id),
      image: this.$post.shareImage(this.post._id)
    }
  }
  // routeClass() {
  //   return "nav-white"
  // },
  // computed: {
  //   post() {
  //     return this.$store.val("post") || {}
  //   }
  // }
}
</script>

<style lang="less">
@import "../prism/prism.less";

.plugins-container-single {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
  background-color: #f6f9fc;

  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  .plugins-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    padding-top: 4rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  // Widget header custom styles
  .plugins-widget-header {
    .header-content {
      display: grid;
      grid-template-columns: 1fr 3fr;
      grid-gap: 2rem;
      align-items: flex-start;

      .header-image {
        display: flex;
        justify-content: center;
        height: 130px;
        padding: 4px;
        border-radius: 6px;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        img {
          width: 50px;
          max-width: 100%;
        }
      }
    }
  }

  .plugin-formated-text {
    /* Code blocks */
    pre {
      background: #f7f9fb;
      box-shadow: var(--box-shadow-input);
      border-radius: 5px;
      position: relative;
      padding: 1.5em;
      overflow-x: auto;

      font-size: 0.9em;
      line-height: 1.4;
      code {
        color: inherit;
        margin: 0;
        padding: 0;
        background: transparent;
      }
    }

    margin: 0 auto;
    h1 {
      font-size: 2.5em;
      line-height: 1.2;
    }
    h2 {
      font-size: 2em;
    }
    h3 {
      font-size: 1.5em;
      margin: 2em 0 1em;
    }
    h4 {
      margin: 1em 0;
      font-size: 1.2em;
      opacity: 0.4;
    }
    h5 {
      margin: 1em 0;
      font-weight: 700;
    }
    h1,
    h2,
    h3,
    h4 {
      font-weight: 500;
      a {
        font-weight: 500;
      }
    }
    h1,
    h2,
    h3,
    h4 {
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
      margin: 45px 0 0;
      padding-bottom: 0.5em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    h3 {
      position: relative;
      &:before {
        content: "#";

        position: absolute;
        left: -0.9em;
        margin-top: -0.15em;
        font-size: 1.2em;
        font-weight: 800;
        opacity: 0.15;
      }
      @media (max-width: 767px) {
        &:before {
          display: none;
        }
      }
    }
    a {
      color: var(--color-primary);
      font-weight: 600;
    }
    img {
      max-width: 100%;
    }
    p,
    ul,
    ol {
      line-height: 1.6;
      padding-bottom: 1.2em;
    }
    ol,
    ul {
      padding-left: 1.5em;
      li {
        margin-bottom: 0.25em;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    blockquote {
      margin-bottom: 2em;
      //padding: 1em 0 1em 1.5em;
      // border-left: 3px solid var(--color-text);
      // background-color: var(--color-bg-contrast);
      padding: 1em 1.4em;
      //border: 1px solid var(--color-placeholder);
      box-shadow: var(--box-shadow-input);
      border-radius: 6px;
      p,
      ul,
      ol {
        &:last-child {
          padding-bottom: 0;
        }
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