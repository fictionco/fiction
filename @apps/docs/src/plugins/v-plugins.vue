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
            <div class="entry-image">icon.svg</div>

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

                <!-- <div v-if="entry.keywords" class="keywords">
                  in
                  <span
                    v-for="(keyword, key) in entry.keywords"
                    :key="key"
                    class="keyword"
                  >{{ keyword }},</span>
                </div>-->

                <div v-if="entry.downloads" class="downloads">{{ entry.downloads }} downloads</div>
              </div>

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
            <div class="entry-image">icon.svg</div>

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
      <div class="plugins-sidebar">
        <div class="sidebar-inner">
          <section class="plugins-popular">
            <header class="section-header">
              <h1 class="title">Popular</h1>
            </header>
            <div v-for="(entry, index) in pluginsPopular" :key="index" class="entry-plugin">
              <div class="entry-image">icon</div>

              <div class="entry-content">
                <h3 class="title">
                  <factor-link :path="pluginPermalink(entry._id)">{{ formatName(entry.name) }}</factor-link>
                </h3>
                <div class="meta">
                  <div v-if="entry.downloads" class="downloads">{{ entry.downloads }} downloads</div>
                </div>
              </div>
            </div>
          </section>

          <section class="plugins-new">
            <header class="section-header">
              <h1 class="title">New</h1>
            </header>
            <div v-for="(entry, index) in pluginsNew" :key="index" class="entry-plugin">
              <div class="entry-image">icon</div>

              <div class="entry-content">
                <h3 class="title">
                  <factor-link :path="pluginPermalink(entry._id)">{{ formatName(entry.name) }}</factor-link>
                </h3>
                <div class="meta">
                  <div v-if="entry.time.created" class="released">
                    Released
                    {{ formatDate(entry.time.created) }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="plugins-updated">
            <header class="section-header">
              <h1 class="title">Recently Updated</h1>
            </header>
            <div v-for="(entry, index) in pluginsRecentlyUpdated" :key="index" class="entry-plugin">
              <div class="entry-image">icon</div>

              <div class="entry-content">
                <h3 class="title">
                  <factor-link :path="pluginPermalink(entry._id)">{{ formatName(entry.name) }}</factor-link>
                </h3>
                <div class="meta">
                  <div v-if="entry.time.created" class="released">
                    Updated
                    {{ formatDate(entry.time.modified) }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
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
    "widget-cta": () => import("./widget-cta")
  },
  data() {
    return {
      loading: true,
      getData: "",
      today: new Date()
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
    },
    pluginsPopular: function() {
      let getPopular = [].slice.call(this.getData).sort(function(a, b) {
        return b.downloads - a.downloads
      })

      return getPopular.slice(0, 3)
    },
    pluginsNew: function() {
      let getNew = [].slice.call(this.getData).sort(function(a, b) {
        return new Date(b.time.created) - new Date(a.time.created)
      })

      return getNew.slice(0, 3)
    },
    pluginsRecentlyUpdated: function() {
      let getRecentlyUpdated = [].slice.call(this.getData).sort(function(a, b) {
        return new Date(b.time.modified) - new Date(a.time.modified)
      })

      return getRecentlyUpdated.slice(0, 3)
    }
  },
  async mounted() {
    const data = this.$store.val("plugins-index")

    this.getData = data

    this.loading = false
  },
  methods: {
    formatName(name) {
      // Replace dashes with spaces to entry name
      let spacedName = name.replace(/(?:^|[\s\-\_\.])/g, " ")

      // Return entry name without @factor text
      return spacedName.replace("@factor/", "")
    },
    pluginPermalink(permalink) {
      return `/plugin/` + permalink.replace("@factor/", "")
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
    }

    // pluginIcon(value) {
    //   const URL = require("url")
    //   const imagePattern = /\.(png|gif|jpg|svg|bmp|icns|ico|sketch)$/i
    //   const branch = "master"

    //   const url = URL.format({
    //     protocol: "https:",
    //     hostname: "api.github.com",
    //     pathname: `repos/fiction-com/${value}/git/trees/${branch}`,
    //     query: {
    //       recursive: "1"
    //     }
    //   })

    //   github(url, opts)
    //     .then(response => {
    //       var images = []
    //       console.log(response.body.tree)
    //       if (response && response.body && response.body.tree) {
    //         images = response.body.tree
    //           .filter(image => !!image.path.match(imagePattern))
    //           .map(image => {
    //             image.rawgit = URL.format({
    //               protocol: "https:",
    //               hostname: "cdn.rawgit.com",
    //               pathname: `${value}/${branch}/${image.path}`
    //             })
    //             return image
    //           })
    //       }
    //       return callback(null, images)
    //     })
    //     .catch(error => {
    //       return callback(error)
    //     })

    //   return url
    // }
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
  background-color: #f6f9fc;
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
      grid-template-columns: 1fr 3fr;
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
              //color: var(--color-text);
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
            &.categories .category {
              display: inherit;
              &:after {
                content: ", ";
              }
              &:last-of-type {
                &:after {
                  content: initial;
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
      grid-template-columns: 1fr 3fr;
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
              //color: var(--color-text);
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
            &.categories .category {
              display: inherit;
              &:after {
                content: ", ";
              }
              &:last-of-type {
                &:after {
                  content: initial;
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

  // POPULAR, NEW, AND RECENTLY UPDATED PLUGINS

  .plugins-popular .section-header {
    margin: 0 0 1rem;
  }

  .plugins-new,
  .plugins-updated {
    .section-header {
      margin: 2rem 0 1rem;
    }
  }

  .plugins-popular,
  .plugins-new,
  .plugins-updated {
    .entry-plugin {
      display: grid;
      grid-template-columns: auto 3fr;
      grid-gap: 1rem;
      margin-bottom: 0rem;
      padding: 0.5rem 1rem 0.5rem 0;
      border-radius: 6px;
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      position: relative;
      .entry-image {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transform-origin: right top;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
        img {
          max-width: 70%;
        }
      }
      .entry-content {
        .title {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 5px;
        }
        .meta {
          font-size: 0.8rem;
        }
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr 3fr;
        padding: 1rem;
        background: #fff;
        border-radius: 6px;
        border: 1px solid var(--color-bg-contrast-more);
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
        .entry-image {
          height: 130px;
          width: auto;
          border-radius: 0;
          box-shadow: none;
          background: var(--color-bg-contrast);
          border: 1px solid var(--color-bg-contrast-more);
        }
        .entry-content {
          .title {
            font-size: 1.6em;
          }
        }
      }
    }
  }

  // PLUGINS SIDEBAR
  .plugins-sidebar {
    padding: 0;
    margin-bottom: 4rem;

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
  }
}
</style>
