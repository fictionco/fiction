<template>
  <div class="plugins-container-single">
    <widget-header :image="entry.image" :title="entry.title">
      <div slot="subtitle">
        <span v-if="entry.author">by {{ entry.author }}</span>

        <div v-if="entry.categories.length > 0" class="categories">
          in
          <span
            v-for="(cat, ci) in filterCategories(entry.categories)"
            :key="ci"
            class="category"
          >{{ cat.name }}</span>
        </div>

        <div v-if="entry.download_count" class="downloads">{{ entry.download_count }} Downloads</div>
      </div>
    </widget-header>

    <div class="plugins-wrap content-pad">
      <div class="content">
        <factor-link class="back" :path="$setting.get('plugins.indexRoute')">
          <factor-icon icon="arrow-left" />
          <span>{{ returnLinkText }}</span>
        </factor-link>
        <div v-if="entry.screenshots" class="plugin-images">
          <div v-for="(image, i) in entry.screenshots" :key="i" class="image-item">
            <div :style="styleImageBG(image)" class="image-item-content"></div>
          </div>
        </div>
        <plugin-entry :text="getReadme" class="plugin-content" />
      </div>

      <div class="sidebar">
        <plugins-sidebar />
      </div>
    </div>

    <widget-cta />
  </div>
</template>
<script>
import getPlugins from "./json/entries"

export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "plugin-entry": () => import("../el/entry"),
    "plugins-sidebar": () => import("./plugins-sidebar"),
    "widget-cta": () => import("./widget-cta")
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
    entry() {
      // All plugins
      let entries = this.entriesJSON.entries

      // Current page slug
      let pageSlug = this.$route.params.permalink

      // Find plugin with same page slug
      let entry = entries.find(entry => entry.permalink === pageSlug)

      return entry
    },
    getReadme() {
      //let markdownFile = this.post.content
      let markdownContent = require(`${this.entry.content}`)

      return markdownContent
        ? this.$markdown.render(markdownContent, { variables: true })
        : ""
    }
  },
  mounted() {
    require("../prism/prism.js")

    this.prism = window.Prism
  },
  methods: {
    styleImageBG(img) {
      const { url } = img

      return url ? { backgroundImage: `url(${url})` } : {}
    },
    filterCategories: function(items) {
      return items.filter(function(item) {
        // Don't display featured category
        return item.slug != "featured"
      })
    }
  }
  // metaInfo() {
  //   return {
  //     title: this.$post.titleTag(this.entry._id),
  //     description: this.$post.descriptionTag(this.entry._id),
  //     image: this.$post.shareImage(this.entry._id)
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
    align-items: start;
    padding-top: 4rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  // Widget header custom styles
  .plugins-widget-header {
    .content-pad {
      grid-template-columns: 1fr;
    }
    .header-content {
      display: grid;
      grid-template-columns: 150px 3fr;
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
      .page-title-sub .categories {
        display: inline-block;
        .category {
          display: inherit;
          &:after {
            content: ", ";
            padding-right: 5px;
          }
          &:last-of-type {
            &:after {
              content: initial;
            }
          }
        }
      }
      .page-title-sub .downloads {
        display: inline-block;
        margin-left: 2rem;
        @media (max-width: 900px) {
          display: block;
          margin-left: 0;
        }
      }
    }
  }

  .content {
    .back {
      display: block;
      font-size: 1.2em;
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0 0 1.5rem;
    }
    .plugin-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 100px));
      grid-gap: 1rem;
      margin: 0 0 1.5rem;
      .image-item {
        .image-item-content {
          width: 100%;
          padding: 50% 0;
          position: relative;
          background-size: cover;
          background-position: 50%;
          border-radius: 6px;
          box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.25),
            0 1px 3px -1px rgba(0, 0, 0, 0.3);
          background-size: cover;
          transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
          &:hover {
            transform: translateY(-0.2rem);
          }
        }
      }
    }
  }
}
</style>