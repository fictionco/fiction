<template>
  <div class="themes-container-single">
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else>
      <section v-for="(entry, index) in themeData" :key="index">
        <widget-header :image="themeIcon(entry.githubFiles)" :title="formatName(entry.name)">
          <div slot="subtitle">
            <div v-if="entry.maintainers" class="authors">
              by
              <span
                v-for="(author, au) in entry.maintainers"
                :key="au"
                class="author"
              >{{ author.name }}</span>
            </div>

            <div
              v-if="entry.downloads"
              class="downloads"
            >{{ formatDownloads(entry.downloads) }} downloads</div>
          </div>
        </widget-header>

        <div class="themes-wrap content-pad">
          <div class="content">
            <widget-lightbox
              :visible.sync="lightboxShow"
              :imgs="screenshotsList(entry.githubFiles)"
              :index="lightboxIndex"
            />

            <div v-if="entry.githubFiles" class="theme-images">
              <div
                v-for="(url, i) in screenshotsList(entry.githubFiles)"
                :key="i"
                class="image-item"
              >
                <img :src="url" class="image-item-content" @click="showModal(i)" />
                <!-- <div
                  :style="{ backgroundImage: `url(${url})` }"
                  class="image-item-content"
                  @click="showModal(i)"
                ></div>-->
              </div>
            </div>

            <factor-link btn="primary" path="/">Live Demo &rarr;</factor-link>

            <theme-entry :text="getContent(entry.readme)" class="theme-content" />
          </div>

          <div>
            <!-- <pre>
            {{ entry.versions }}
            </pre>-->
            Latest Version:
            <br />
            updated {{ formatDate(entry.time.modified) }}
            <br />
            released {{ formatDate(entry.time.created) }}
            <br />
            <br />More theme details will go here
          </div>

          <!-- <widget-sidebar :get-data="getData" /> -->
        </div>
      </section>
    </div>

    <widget-cta />
  </div>
</template>
<script>
import { pickBy } from "@factor/tools"
import { getIndex } from "./theme-data"
export default {
  components: {
    "widget-header": () => import("./widget-header.vue"),
    // "widget-sidebar": () => import("./widget-sidebar.vue"),
    "widget-lightbox": () => import("../el/el-lightbox.vue"),
    "theme-entry": () => import("../el/entry.vue"),
    "widget-cta": () => import("./widget-cta.vue")
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
    const data = await getIndex()

    this.$store.add("themes-index", data)
  },
  computed: {
    themeData: function() {
      let pageSlug = this.$route.params.slug
      return pickBy(this.getData, function(u) {
        let name = u.name.replace("@factor/", "")
        return name === pageSlug || ""
      })
    }
  },
  async mounted() {
    let data = this.$store.val("themes-index")

    if (!data) {
      data = await this.$endpoint.request({ id: "themedata", method: "getIndex" })
    }

    this.getData = data

    require("../prism/prism.js")
    this.prism = window.Prism

    this.loading = false
  },
  methods: {
    themeIcon(entry) {
      const imageName = `icon.svg`

      let images = []

      if (entry) {
        images = entry
          .filter(image => !!image.path.match(imageName))
          .map(image => {
            return "https://gitcdn.link/repo/fiction-com/factor/master/" + image.path
          })
      }

      return images[0]
    },
    formatName(name) {
      let spacedName = name.replace(/(?:^|[\s\-_.])/g, " ")

      return spacedName.replace("@factor/", "")
    },
    formatDownloads(number) {
      let num = number
      return num.toLocaleString("en", { useGrouping: true })
    },
    formatDate(value) {
      let date = new Date(value)

      let year = date.getFullYear()
      let month = date.toLocaleString("default", { month: "short" })
      let dt = date.getDate()

      if (dt < 10) {
        dt = "0" + dt
      }
      if (month < 10) {
        month = "0" + month
      }

      return dt + " " + month + " " + year
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
            return "https://gitcdn.link/repo/fiction-com/factor/master/" + image.path
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
      title: "Factor Theme Directory",
      description: "Extend your project features and do more with Factor."
      //image: this.$post.shareImage(this.entry._id)
    }
  }
}
</script>

<style lang="less">
@import "../prism/prism.less";

.themes-container-single {
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

  .themes-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    align-items: start;
    padding-top: 2rem;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .themes-widget-header {
    .content-pad {
      grid-template-columns: 1fr;
    }
    .header-content {
      // .header-image {
      //   display: flex;
      //   justify-content: center;
      //   width: 75px;
      //   height: 75px;
      //   border-radius: 50%;
      //   overflow: hidden;
      //   background: var(--color-bg-contrast);
      //   border: 1px solid var(--color-bg-contrast-more);
      //   box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
      //   img {
      //     width: 100%;
      //     max-width: 100%;
      //   }
      // }

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
      margin-bottom: 1.5rem;
    }

    .theme-images {
      // display: grid;
      // grid-template-columns: repeat(auto-fit, minmax(100px, 130px));
      // grid-gap: 1rem;
      margin-bottom: 1.5rem;
      .image-item {
        cursor: pointer;
        .image-item-content {
          width: 100%;
          //padding: 50% 0;
          position: relative;
          background-size: cover;
          background-position: 50%;
          border-radius: 6px;
          background-color: #fff;
          border: 1px solid var(--color-bg-contrast-more);
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
