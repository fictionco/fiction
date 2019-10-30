<template>
  <div class="plugins-container-single">
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else>
      <section v-for="(entry, index) in pluginData" :key="index">
        <widget-header :image="pluginIcon(entry.github)" :title="formatName(entry.name)">
          <div slot="subtitle">
            <div v-if="entry.maintainers" class="authors">
              by
              <span
                v-for="(author, au) in entry.maintainers"
                :key="au"
                class="author"
              >{{ author.name }}</span>
            </div>

            <div v-if="entry.downloads" class="downloads">{{ entry.downloads }} downloads</div>
          </div>
        </widget-header>

        <div class="plugins-wrap content-pad">
          <div class="content">
            <factor-link class="back" :path="`/pluginsnew`">
              <factor-icon icon="arrow-left" />
              <span>All Plugins</span>
            </factor-link>

            <widget-lightbox
              :visible.sync="lightboxShow"
              :imgs="screenshotsList(entry.github)"
              :index="lightboxIndex"
            />

            <div v-if="entry.github" class="plugin-images">
              <div v-for="(url, i) in screenshotsList(entry.github)" :key="i" class="image-item">
                <div
                  :style="{ backgroundImage: `url(${url})` }"
                  class="image-item-content"
                  @click="showModal(i)"
                ></div>
              </div>
            </div>

            <plugin-entry :text="getContent(entry.readme)" class="plugin-content" />
          </div>

          <widget-sidebar :get-data="getData" />
        </div>
      </section>
    </div>

    <widget-cta />
  </div>
</template>
<script>
import dataUtility from "./plugin-data"
export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "widget-sidebar": () => import("./widget-sidebar"),
    "widget-lightbox": () => import("./widget-lightbox"),
    "plugin-entry": () => import("../el/entry"),
    "widget-cta": () => import("./widget-cta")
  },
  data() {
    return {
      getData: "",
      loading: true,
      lightboxShow: false,
      lightboxIndex: 0
    }
  },
  async serverPrefetch() {
    const data = await dataUtility().getIndex()

    this.$store.add("plugins-index", data)
  },
  computed: {
    pluginData: function() {
      let pageSlug = this.$route.params.slug
      return _.pickBy(this.getData, function(u) {
        let name = u.name.replace("@factor/", "")
        return name === pageSlug || ""
      })
    }
  },
  async mounted() {
    const theData = this.$store.val("plugins-index")

    this.getData = theData

    require("../prism/prism.js")
    this.prism = window.Prism

    this.loading = false
  },
  methods: {
    formatName(name) {
      let spacedName = name.replace(/(?:^|[\s\-\_\.])/g, " ")

      return spacedName.replace("@factor/", "")
    },
    pluginIcon(entry) {
      const imageName = `icon.svg`

      let images = []

      if (entry) {
        images = entry
          .filter(image => !!image.path.match(imageName))
          .map(image => {
            return "https://rawcdn.githack.com/fiction-com/factor/master/" + image.path
          })
      }

      return images[0]
    },
    screenshotsList(list) {
      const imagePattern = /\.(png|gif|jpg|svg|bmp|icns|ico|sketch)$/i
      const imageName = `screenshot`

      let screenshots = []

      if (list) {
        screenshots = list
          .filter(
            image => !!image.path.match(imagePattern) && !!image.path.match(imageName)
          )
          .map(image => {
            return "https://rawcdn.githack.com/fiction-com/factor/master/" + image.path
          })
      }

      return screenshots
    },
    showModal(_ind) {
      this.lightboxIndex = _ind
      this.lightboxShow = true
    },
    getContent(value) {
      let markdownContent = value

      return markdownContent
        ? this.$markdown.render(markdownContent, { variables: true })
        : ""
    }
  },
  metaInfo() {
    return {
      title: "Factor Plugin Library",
      description: "Extend your project features and do more with Factor."
      //image: this.$post.shareImage(this.entry._id)
    }
  }
}
</script>

<style lang="less">
@import "../prism/prism.less";

.plugins-container-single {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;

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
    padding-top: 2rem;
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
      grid-template-columns: 75px 3fr;
      grid-gap: 2rem;
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }

      .header-image {
        display: flex;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
        img {
          width: 100%;
          max-width: 100%;
        }
      }

      .page-title-sub .authors,
      .page-title-sub .categories {
        display: inline-block;
        .category,
        .author {
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
      grid-template-columns: repeat(auto-fit, minmax(100px, 150px));
      grid-gap: 1rem;
      margin: 0 0 1.5rem;
      .image-item {
        cursor: pointer;
        .image-item-content {
          width: 100%;
          padding: 50% 0;
          position: relative;
          background-size: cover;
          background-position: 50%;
          border-radius: 6px;
          background-color: #fff;
          border: 1px solid var(--color-bg-contrast-more);
          // box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.25),
          //   0 1px 3px -1px rgba(0, 0, 0, 0.3);
          background-size: cover;
          transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
          &:hover {
            box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
              0 3px 7px -3px rgba(0, 0, 0, 0.3);
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>