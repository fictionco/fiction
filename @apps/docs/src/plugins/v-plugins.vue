<template>
  <div class="plugins-container">
    <widget-header :title="`Factor Plugin Library`">
      <h3 slot="subtitle">Extend your project features and do more with Factor.</h3>
      <figure-plugins slot="figure" />
    </widget-header>
    <div class="plugins-wrap content-pad">
      <div class="content">
        <section class="plugins-featured">
          <header class="section-header">
            <h1 class="title">Featured</h1>
          </header>
          <div v-if="loading" class="posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="getData.length > 0">
            <div v-for="(entry, index) in pluginsFeatured" :key="index">
              <plugins-item
                :entry="entry"
                :show-downloads="false"
                :show-released="false"
                :show-updated="false"
              />
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
          <div v-if="loading" class="posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="getData.length > 0">
            <div v-for="(entry, index) in getData" :key="index">
              <plugins-item
                :entry="entry"
                :show-downloads="false"
                :show-released="false"
                :show-updated="false"
              />
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
            <div v-if="loading" class="posts-loading">
              <factor-loading-ring />
            </div>
            <div v-else-if="getData.length > 0">
              <div v-for="(entry, index) in pluginsPopular" :key="index" class="plugins-item">
                <plugins-item
                  :entry="entry"
                  :show-author="false"
                  :show-categories="false"
                  :show-released="false"
                  :show-updated="false"
                  :text="false"
                />
              </div>
            </div>
          </section>

          <section class="plugins-new">
            <header class="section-header">
              <h1 class="title">New</h1>
            </header>
            <div v-if="loading" class="posts-loading">
              <factor-loading-ring />
            </div>
            <div v-else-if="getData.length > 0">
              <div v-for="(entry, index) in pluginsNew" :key="index" class="plugins-item">
                <plugins-item
                  :entry="entry"
                  :show-author="false"
                  :show-categories="false"
                  :show-downloads="false"
                  :show-updated="false"
                  :text="false"
                />
              </div>
            </div>
          </section>

          <section class="plugins-updated">
            <header class="section-header">
              <h1 class="title">Recently Updated</h1>
            </header>
            <div v-if="loading" class="posts-loading">
              <factor-loading-ring />
            </div>
            <div v-else-if="getData.length > 0">
              <div
                v-for="(entry, index) in pluginsRecentlyUpdated"
                :key="index"
                class="plugins-item"
              >
                <plugins-item
                  :entry="entry"
                  :show-author="false"
                  :show-categories="false"
                  :show-released="false"
                  :text="false"
                />
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
export default {
  components: {
    "widget-header": () => import("./widget-header"),
    "figure-plugins": () => import("./figure-plugins"),
    "plugins-item": () => import("./plugins-item"),
    "widget-cta": () => import("./widget-cta")
  },
  data() {
    return {
      loading: false,
      getData: "",
      today: new Date()
    }
  },
  computed: {
    headerFigure() {
      return () => import("./figure-plugins.vue")
    },
    pluginsFeatured: function() {
      return _.pickBy(this.getData, function(u) {
        return u.index.data.downloads > 100 || ""
      })
    },
    pluginsPopular: function() {
      let getPlugins = this.getData.slice()

      getPlugins.sort((a, b) => {
        return new Date(b.index.data.downloads) - new Date(a.index.data.downloads)
      })

      // return _.pickBy(getPlugins, function(u) {
      //   return u.index.data.downloads > 8 || ""
      // })

      return getPlugins
    },
    pluginsNew: function() {
      let getPlugins = this.getData.slice()

      getPlugins.sort((a, b) => {
        return new Date(b.time.created) - new Date(a.time.created)
      })

      return getPlugins //.slice(0, 4) Limit to 4
    },
    pluginsRecentlyUpdated: function() {
      let getPlugins = this.getData.slice()

      getPlugins.sort((a, b) => {
        return new Date(b.time.modified) - new Date(a.time.modified)
      })

      return getPlugins //.slice(0, 4) Limit to 4
    }
  },
  async mounted() {
    this.loading = true

    const data = await dataUtility().getReadme()

    this.getData = data

    this.loading = false
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

      .page-title {
        font-size: 3.5em;
        line-height: 1.1;
        font-weight: 500;
        margin: 0 0 1rem;
        letter-spacing: -0.03em;
      }
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

  //  ENTRIES FEATURED
  .plugins-featured {
    .section-header {
      margin: 0 0 1rem;
    }
    .plugins-item .entry-plugin {
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      //transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      // &:hover {
      //   box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      //   transform: translateY(-0.4rem);
      // }
      .entry-image {
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
      }
    }
  }

  // SEARCH AND CATEGORIES
  .plugins-search-wrap {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr auto;
  }

  //  ENTRIES ALL
  .plugins-all {
    .section-header {
      margin: 4rem 0 1.5rem;
    }
    .plugins-item .entry-plugin {
      padding: 1rem;
      background: #fff;
      border-radius: 6px;
      border: 1px solid var(--color-bg-contrast-more);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      // &:hover {
      //   box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      //   transform: translateY(-0.4rem);
      // }
      .entry-image {
        background: var(--color-bg-contrast);
        border: 1px solid var(--color-bg-contrast-more);
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

    // Popular
    .plugins-popular {
      .section-header {
        margin: 0 0 1rem;
      }
    }
    // New & Recently Updated
    .plugins-new,
    .plugins-updated {
      .section-header {
        margin: 2rem 0 1rem;
      }
    }

    // Popular, New, & Recently Updated
    .plugins-item .entry-plugin {
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
        // box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        //   rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
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
      // &:hover {
      //   box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      //   background-color: #fff;
      //   transform: translateY(-0.4rem);
      //   .entry-image {
      //     transform: scale(0.85);
      //   }
      // }

      @media (max-width: 900px) {
        grid-template-columns: 1fr 3fr;
        padding: 1rem;
        background: #fff;
        border-radius: 6px;
        border: 1px solid var(--color-bg-contrast-more);
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

        &:hover {
          box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.07),
            0px 18px 26px rgba(80, 102, 119, 0.16);
          //transform: translateY(-0.4rem);
          // .entry-image {
          //   transform: none;
          // }
        }
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
}
</style>
