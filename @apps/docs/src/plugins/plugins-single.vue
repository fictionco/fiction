<template>
  <div class="plugins-single single-plugin-entry">
    <div v-if="!$lodash.isEmpty(post)">
      <widget-header :image="post.image" :title="post.title">
        <div slot="subtitle">
          Author, Categories, and Download Count.
          <span v-if="post.author">by {{ post.author }}</span>
          <span v-if="post.categories">in{{ post.categories }}</span>
          <span v-if="post.downloads">{{ post.downloads }} Downloads</span>
        </div>
      </widget-header>
      <div class="plugins-single-wrap content-pad">
        <div class="content">
          <p>Author: {{ post.author }}</p>
          <p>Text: {{ post.text }}</p>
          <div>
            Rendered Content:
            <div v-formatted-text="getReadme" />
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
    // postOld() {
    //   // Get post
    //   // return this.$store.val(this.postId) || {}
    //   return this.$store.val(this) || {}
    // },
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

      // return this.$markdown.render("./commentizer/" + this.post.content, {
      //   variables: false
      // })

      return markdownContent
        ? this.$markdown.render(markdownContent, { variables: true })
        : ""

      //return $markdown.render(markdownContent, { variables: true })
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

.plugins-single {
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
  .plugins-single-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 4rem;
    padding-top: 4rem;
  }
}
</style>