<template>
  <div class="themes-container">
    <widget-header :title="`Factor Themes Library`">
      <h3 slot="subtitle">Create beautiful apps in minutes.</h3>
      <!-- <figure-themes slot="figure" /> -->
    </widget-header>

    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else class="themes-wrap content-pad">
      <div class="content">
        <section v-if="themesFeatured.length > 0" class="themes-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <div class="themes-grid">
            <factor-link
              v-for="(entry, index) in themesFeatured"
              :key="index"
              :path="permalink(entry._id)"
              class="entry-theme"
            >
              <div v-if="themeScreenshot(entry.githubFiles)" class="entry-image">
                <img :src="themeScreenshot(entry.githubFiles)" :alt="entry.name" />
              </div>

              <div class="entry-content">
                <h3 class="title">{{ formatName(entry._id) }}</h3>
                <div class="meta">
                  <div v-if="entry.maintainers" class="authors">
                    by
                    <span
                      v-for="(author, au) in entry.maintainers"
                      :key="au"
                      class="author"
                    >{{ author.name }}</span>
                  </div>
                  <!-- <div
                    v-if="entry.downloads"
                    class="downloads"
                  >{{ formatDownloads(entry.downloads) }} downloads</div>-->
                </div>

                <p v-if="entry.description" class="text">{{ entry.description }}</p>
              </div>
            </factor-link>
          </div>
        </section>
        <!-- 
          themes Categories and Search
          <div class="themes-search-wrap">
          <factor-input-wrap
            input="factor-input-text"
            :placeholder="`Search Factor themes`"
            required
          />
          <factor-input-wrap
            :list="['seo', 'Utilities', 'Jobs', 'Comments', 'Syntax']"
            input="factor-input-select"
            :placeholder="`All Categories`"
          />
        </div>-->
        <section class="themes-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <div class="themes-grid">
            <factor-link
              v-for="(entry, index) in getData"
              :key="index"
              :path="permalink(entry._id)"
              class="entry-theme"
            >
              <div v-if="themeScreenshot(entry.githubFiles)" class="entry-image">
                <img :src="themeScreenshot(entry.githubFiles)" :alt="entry.name" />
              </div>

              <div class="entry-content">
                <h3 class="title">{{ formatName(entry._id) }}</h3>
                <div class="meta">
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

                <p v-if="entry.description" class="text">{{ entry.description }}</p>
              </div>
            </factor-link>
          </div>
        </section>
      </div>
      <div>
        <widget-sidebar :themes-data="getData" />
      </div>
    </div>

    <widget-cta />
  </div>
</template>

<script>
import dataUtility from "./theme-data"
import themes from "../themes"
export default {
  components: {
    "widget-header": () => import("./widget-header"),
    //"figure-themes": () => import("./figure-themes"),
    "widget-sidebar": () => import("./widget-sidebar"),
    "widget-cta": () => import("./widget-cta")
  },
  data() {
    return {
      loading: true,
      getData: ""
    }
  },
  async serverPrefetch() {
    const data = await dataUtility().getIndex()

    this.$store.add("themes-index", data)
  },
  computed: {
    themesFeatured: function() {
      let getFeatured = this.getData

      // _.pickBy(this.getData, function(u) {
      //   return (
      //     (u.keywords.includes("factor-theme") &&
      //       u.keywords.includes("factor-featured")) ||
      //     ""
      //   )
      // })

      let orderFeatured = _.orderBy(getFeatured, ["downloads"], ["desc"])

      return Object.values(orderFeatured).slice(0, 2) //limit to 2 posts
    }
  },
  async mounted() {
    const data = this.$store.val("themes-index")

    this.getData = data

    this.loading = false
  },
  methods: {
    formatName(name) {
      let spacedName = name.replace(/(?:^|[\s\-\_\.])/g, " ")

      return spacedName.replace("@factor/", "")
    },
    formatDownloads(number) {
      let num = number
      return num.toLocaleString("en", { useGrouping: true })
    },
    permalink(permalink) {
      return `/theme/` + permalink.replace("@factor/", "")
    },
    themeScreenshot(entry) {
      const imageName = `screenshot.jpg`

      let images = []

      if (entry) {
        images = entry
          .filter(image => !!image.path.match(imageName))
          .map(image => {
            return "https://rawcdn.githack.com/fiction-com/factor/master/" + image.path
          })
      }

      return images[0]
    }
  },
  metaInfo() {
    return {
      title: "Factor Theme Library",
      description: "Extend your project features and do more with Factor."
    }
  }
}
</script>
<style lang="less">
.themes-container {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
  .posts-loading .loading-ring-wrap {
    min-height: 400px;
  }
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  /* HEADER */
  .header {
    background-image: url("./img/dot.svg");
    overflow: hidden;

    .content-pad {
      display: grid;
      grid-template-columns: 4fr 3fr;
    }

    .header-content {
      padding: 4em 0;

      .page-title-sub {
        font-size: 1.6em;
        opacity: 0.7;
      }
      @media (max-width: 900px) {
        padding: 3rem 0;
        .page-title {
          font-size: 1.7em;
          line-height: 1.3;
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.1;
        }
      }
    }

    .header-figure {
      position: relative;
    }

    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
      }
    }
  }

  /* PAGE CONTENT */
  .themes-wrap {
    display: grid;
    grid-template-columns: 7fr 3fr;
    grid-gap: 6rem;
    padding-top: 2rem;

    .section-header {
      .title {
        font-size: 1.6em;
        font-weight: 500;
        line-height: 1.1;
        letter-spacing: -0.02em;

        @media (max-width: 900px) {
          font-size: 1.7em;
          line-height: 1.2;
        }
      }
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-gap: 1rem;
    }
  }

  //  FEATURED THEMES
  .themes-featured {
    .section-header {
      margin: 0 0 1rem;
    }
    .themes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .entry-theme {
      padding: 1.5rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      color: var(--color-text);

      &:hover {
        background: #f6f9fc;
        .entry-image {
          box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
            0 3px 7px -3px rgba(0, 0, 0, 0.3);
        }
        .entry-content .title {
          color: var(--color-primary);
        }
      }
      .entry-image {
        display: block;
        height: 70px;
        width: 70px;
        margin-bottom: 1rem;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3);
        img {
          width: 100%;
        }
      }
      .entry-content {
        overflow: hidden;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          color: rgba(var(--color-text-rgb), 0.6);
          > div {
            display: inline-block;
            margin-right: 1rem;
            &:last-child {
              margin-right: 0;
            }
            &.categories,
            &.authors {
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
          }
        }
        .text {
          line-height: 1.7em;
          margin: 0.5em 0;
        }
      }
    }
  }

  // // SEARCH AND CATEGORIES
  // .themes-search-wrap {
  //   display: grid;
  //   grid-gap: 1rem;
  //   grid-template-columns: 1fr auto;
  // }

  //  ENTRIES ALL
  .themes-all {
    .section-header {
      margin: 2rem 0 1.5rem;
    }
    .themes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .entry-theme {
      display: block;
      //overflow: hidden;
      margin-bottom: 1.5rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      color: var(--color-text);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &:hover {
        background: #f6f9fc;
        transform: translateY(-7px);
        box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
          0 3px 7px -3px rgba(0, 0, 0, 0.3);
        .entry-content .title {
          color: var(--color-primary);
        }
      }

      .entry-image {
        display: block;
        width: 100%;
        border-radius: 6px 6px 0 0;
        overflow: hidden;
        background: var(--color-bg-contrast);
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .entry-content {
        overflow: hidden;
        padding: 1.5rem;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .meta {
          color: rgba(var(--color-text-rgb), 0.6);
          > div {
            display: inline-block;
            margin-right: 1rem;
            &:last-child {
              margin-right: 0;
            }
            &.categories,
            &.authors {
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
          }
        }
        .text {
          line-height: 1.7em;
          margin: 0.5em 0;
        }
      }
    }
  }
}
</style>
