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
            <article v-for="(entry, index) in themesFeatured" :key="index" class="article-tile">
              <factor-link :path="permalink(entry._id)" class="entry-theme">
                <div
                  v-if="themeScreenshot(entry.githubFiles)"
                  :style="{ backgroundImage: `url(${themeScreenshot(entry.githubFiles)})` }"
                  class="entry-image"
                ></div>

                <div class="entry-content">
                  <h1 class="title">{{ formatName(entry._id) }}</h1>
                  <div class="meta">
                    <div v-if="entry.maintainers" class="authors">
                      by
                      <span
                        v-for="(author, au) in entry.maintainers"
                        :key="au"
                        class="author"
                      >{{ $utils.toLabel(author.name ) }}</span>
                    </div>
                    <div
                      v-if="entry.downloads"
                      class="downloads"
                    >{{ formatDownloads(entry.downloads) }} downloads</div>
                  </div>
                  <!-- <p v-if="entry.description" class="text">{{ entry.description }}</p>-->
                </div>
              </factor-link>
            </article>
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
              <div
                v-if="themeScreenshot(entry.githubFiles)"
                :style="{ backgroundImage: `url(${themeScreenshot(entry.githubFiles)})` }"
                class="entry-image"
              ></div>

              <div class="entry-content">
                <h3 class="title">{{ formatName(entry._id) }}</h3>
                <div class="meta">
                  <div v-if="entry.maintainers" class="authors">
                    by
                    <span
                      v-for="(author, au) in entry.maintainers"
                      :key="au"
                      class="author"
                    >{{ $utils.toLabel(author.name ) }}</span>
                  </div>

                  <div
                    v-if="entry.downloads"
                    class="downloads"
                  >{{ formatDownloads(entry.downloads) }} downloads</div>
                </div>
              </div>
            </factor-link>
          </div>
        </section>
      </div>
      <div>
        <widget-sidebar :get-data="getData" />
      </div>
    </div>

    <widget-cta />
  </div>
</template>

<script>
import { getIndex } from "./theme-data"
import { orderBy } from "@factor/tools"
export default {
  components: {
    "widget-header": () => import("./widget-header.vue"),
    //"figure-themes": () => import("./figure-themes"),
    "widget-sidebar": () => import("./widget-sidebar.vue"),
    "widget-cta": () => import("./widget-cta.vue")
  },
  data() {
    return {
      loading: true,
      getData: ""
    }
  },
  async serverPrefetch() {
    const data = await getIndex()

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

      let orderFeatured = orderBy(getFeatured, ["downloads"], ["desc"])

      return Object.values(orderFeatured).slice(0, 2) //limit to 2 posts
    }
  },
  async mounted() {
    let data = this.$store.val("themes-index")

    if (!data) {
      data = await this.$endpoint.request({ id: "themedata", method: "getIndex" })
    }

    this.getData = data

    this.loading = false
  },
  methods: {
    formatName(name) {
      let spacedName = name.replace(/(?:^|[\s\-_.])/g, " ")

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
            return "https://gitcdn.link/repo/fiction-com/factor/master/" + image.path
          })
      } else {
        images = `./img/icon-factor.svg`
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
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #fff;
      border-radius: 4px;
      color: var(--color-text);
      transition: 0.59s cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
        .entry-image {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
        // .entry-content .title {
        //   color: var(--color-primary);
        // }
      }

      .entry-image {
        display: block;
        border-radius: 4px 4px 0 0;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        width: 100%;
        padding-top: calc((9% / 16) * 100);
        overflow: hidden;
        -webkit-clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        transition: -webkit-clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
          clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1);

        @media (max-width: 900px) {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
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
          color: #aab7c4;
          //color: rgba(var(--color-text-rgb), 0.6);
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
      margin-bottom: 1.5rem;
      background: #fff;
      border-radius: 6px;
      color: var(--color-text);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      &:hover {
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
        .entry-image {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
        }
        // .entry-content .title {
        //   color: var(--color-primary);
        // }
      }

      .entry-image {
        display: block;
        border-radius: 4px 4px 0 0;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        width: 100%;
        padding-top: calc((9% / 16) * 100);
        overflow: hidden;
        -webkit-clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        clip-path: inset(8% 4% 0 4% round 4px 4px 4px 4px);
        transition: -webkit-clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1),
          clip-path 300ms cubic-bezier(0.215, 0.61, 0.355, 1);

        @media (max-width: 900px) {
          -webkit-clip-path: inset(0 0 0 0 round 4px 4px 0 0); //Safari
          clip-path: inset(0 0 0 0 round 4px 4px 0 0);
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
