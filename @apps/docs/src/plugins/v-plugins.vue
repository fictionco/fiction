<template>
  <div class="plugins-container">
    <widget-header :title="`Factor Plugin Library`">
      <h3 slot="subtitle">Extend your project features and do more with Factor.</h3>
      <figure-plugins slot="figure" />
    </widget-header>

    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else class="plugins-wrap content-pad">
      <div class="content">
        <section class="plugins-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <div v-for="(entry, index) in pluginsFeatured" :key="index" class="entry-plugin">
            <div v-if="pluginIcon(entry.github)" class="entry-image">
              <img :src="pluginIcon(entry.github)" :alt="entry.name" />
            </div>

            <div class="entry-content">
              <h3 class="title">
                <factor-link :path="pluginPermalink(entry._id)">{{ formatName(entry._id) }}</factor-link>
              </h3>
              <!-- <div class="meta">
                <div v-if="entry.maintainers" class="authors">
                  by
                  <span
                    v-for="(author, au) in entry.maintainers"
                    :key="au"
                    class="author"
                  >{{ author.name }}</span>
                </div>

                <div v-if="entry.keywords" class="keywords">
                  in
                  <span
                    v-for="(keyword, key) in entry.keywords"
                    :key="key"
                    class="keyword"
                  >{{ keyword }},</span>
                </div>

                <div v-if="entry.downloads" class="downloads">{{ entry.downloads }} downloads</div>
              </div>-->

              <p v-if="entry.description" class="text">{{ entry.description }}</p>
            </div>
          </div>
        </section>
        <!-- 
          Plugins Categories and Search
          <div class="plugins-search-wrap">
          <factor-input-wrap
            input="factor-input-text"
            :placeholder="`Search Factor plugins`"
            required
          />
          <factor-input-wrap
            :list="['seo', 'Utilities', 'Jobs', 'Comments', 'Syntax']"
            input="factor-input-select"
            :placeholder="`All Categories`"
          />
        </div>-->
        <section class="plugins-all">
          <header class="section-header">
            <h1 class="title">All</h1>
          </header>
          <div v-for="(entry, index) in getData" :key="index" class="entry-plugin">
            <div v-if="pluginIcon(entry.github)" class="entry-image">
              <img :src="pluginIcon(entry.github)" :alt="entry.name" />
            </div>

            <div class="entry-content">
              <h3 class="title">
                <factor-link :path="pluginPermalink(entry._id)">{{ formatName(entry._id) }}</factor-link>
              </h3>
              <div class="meta">
                <div v-if="entry.maintainers" class="authors">
                  by
                  <span
                    v-for="(author, au) in entry.maintainers"
                    :key="au"
                    class="author"
                  >{{ author.name }}</span>
                </div>
              </div>

              <p v-if="entry.description" class="text">{{ entry.description }}</p>
            </div>
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
import dataUtility from "./plugin-data"
import plugins from "../extensions"
export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "figure-plugins": () => import("./figure-plugins"),
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

    this.$store.add("plugins-index", data)
  },
  computed: {
    headerFigure() {
      return () => import("./figure-plugins.vue")
    },
    pluginsFeatured: function() {
      let getFeatured = _.pickBy(this.getData, function(u) {
        return u.downloads > 100 || ""
      })

      return Object.values(getFeatured).slice(0, 3) //limit to 3 posts
    }
  },
  async mounted() {
    const data = this.$store.val("plugins-index")

    this.getData = data

    this.loading = false
  },
  methods: {
    formatName(name) {
      let spacedName = name.replace(/(?:^|[\s\-\_\.])/g, " ")

      return spacedName.replace("@factor/", "")
    },
    pluginPermalink(permalink) {
      return `/plugin/` + permalink.replace("@factor/", "")
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
    }
  },
  metaInfo() {
    return {
      title: "Factor Plugin Library",
      description: "Extend your project features and do more with Factor."
    }
  }
}
</script>
<style lang="less">
.plugins-container {
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
    background-color: #f6f9fc;
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
  .plugins-wrap {
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
    }
  }

  //  FEATURED PLUGINS
  .plugins-featured {
    .section-header {
      margin: 0 0 1rem;
    }
    .entry-plugin {
      display: grid;
      grid-template-columns: 70px 3fr;
      grid-gap: 2rem;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);

      &:hover {
        .entry-content .title a {
          color: var(--color-primary);
        }
      }
      a {
        text-decoration: none;
      }
      .entry-image {
        display: flex;
        justify-content: center;
        height: 70px;
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
      .entry-content {
        overflow: hidden;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
          a {
            color: var(--color-text);
            &:hover {
              color: var(--color-primary);
            }
          }
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
  // .plugins-search-wrap {
  //   display: grid;
  //   grid-gap: 1rem;
  //   grid-template-columns: 1fr auto;
  // }

  //  ENTRIES ALL
  .plugins-all {
    .section-header {
      margin: 4rem 0 1.5rem;
    }
    .entry-plugin {
      display: grid;
      grid-template-columns: 70px 3fr;
      grid-gap: 2rem;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);

      &:hover {
        .entry-content .title a {
          color: var(--color-primary);
        }
      }
      a {
        text-decoration: none;
      }
      .entry-image {
        display: flex;
        justify-content: center;
        height: 70px;
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
      .entry-content {
        overflow: hidden;
        .title {
          font-size: 1.6em;
          line-height: 1.2em;
          margin-bottom: 5px;
          text-transform: capitalize;
          a {
            color: var(--color-text);
            &:hover {
              color: var(--color-primary);
            }
          }
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
