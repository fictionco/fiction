<template>
  <div class="view-careers">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="label label-white">Careers</div>
        <h1 class="title">Let's Create Something Beautiful Together</h1>
        <p class="subtitle">
          Fiction is on a mission to help frontend developers create better Javascript
          apps.
        </p>
        <a href="#current-openings">
          <factor-btn path="#current-openings" btn="primary" size="large" class="see-openings">
            Check Our Current Openings
            <factor-icon icon="arrow-down" />
          </factor-btn>
        </a>
      </div>
    </section>

    <section id="current-openings" class="careers">
      <div class="mast careers-inner">
        <h1 class="title">Current Job Openings</h1>
        <div class="jobs-entries">
          <component :is="setting('jobs.components.returnLink')" v-if="page > 1" />
          <div v-if="loading" class="jobs-posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="jobsPosts.length > 0" class="jobs-post-index">
            <div v-for="post in jobsPosts" :key="post._id" class="jobs-post">
              <div>
                <component
                  :is="setting(`jobs.components.${comp}`)"
                  v-for="(comp, i) in setting('jobs.layout.index')"
                  :key="i"
                  :post-id="post._id"
                />
              </div>
            </div>
          </div>
          <div v-else class="job-posts-not-found">
            <div class="text">
              <div class="title">{{ setting("jobs.notFound.title") }}</div>
              <div class="sub-title">{{ setting("jobs.notFound.subTitle") }}</div>
            </div>
          </div>
          <component :is="setting('jobs.components.pagination')" :post-type="postType" />
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { factorBtn, factorLink, factorLoadingRing, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtn, factorLink, factorLoadingRing, factorIcon },
  data() {
    return {
      postType: "jobs",
      loading: false
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("jobs.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("jobs.metatags.index.description")

    return {
      title,
      description
    }
  },
  routeClass() {
    return "nav-white"
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return stored(this.postType) || {}
    },
    jobsPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    getPost(_id) {
      return stored(_id) || {}
    },
    async getPosts() {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("jobs.limit")
      })

      this.loading = false
    }
  }
})
</script>

<style lang="less">
.view-careers {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 900px) {
      padding: 0.5em;
    }
  }

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    &.label-blue {
      color: var(--color-primary);
    }
    &.label-pink {
      color: var(--color-secondary);
    }
    &.label-white {
      color: #fff;
      opacity: 0.4;
    }
  }

  .splash-wrap {
    background-image: url(./img/world-left.svg), url(./img/world-right.svg);
    background-color: #1b223c;
    background-position: left -100px center, right -500px center;
    background-repeat: no-repeat;
    background-size: contain;
    @media (max-width: 767px) {
      background-position: left -300px center, right -350px center;
      button.app-btn.large {
        font-size: 1em;
      }
    }
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      text-align: center;
      max-width: 670px;
      padding: 7em 0 10em;
      @media (max-width: 767px) {
        padding: 6em 2em 8em;
        text-align: left;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 4em;
        letter-spacing: -0.03em;
        line-height: 1;
        margin: 0.3em 0;
        color: #f9f9f9;
        @media (max-width: 767px) {
          font-size: 2.6em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        line-height: 1.6em;
        font-weight: 400;
        margin-bottom: 1.5em;
        color: #fff;

        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }
  }

  // Careers
  .careers {
    position: relative;
    padding: 0 0 3em;
    border-bottom: 1px solid rgba(80, 102, 119, 0.1);
    @media (max-width: 767px) {
      padding: 0 1em 3em;
    }
    .careers-inner {
      max-width: 800px;
      margin-top: -80px;
      background: #fff;
      border-radius: 0.5em;
      padding: 3em;

      @media (max-width: 767px) {
        padding: 1em;
      }
    }
    .title {
      font-size: 2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
    }
  }
  .jobs-posts-not-found,
  .jobs-posts-loading {
    min-height: 50vh;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    .title {
      font-size: 1.4em;
      font-weight: var(--font-weight-bold);
    }
  }
  .jobs-entries {
    .jobs-post-index {
      margin-top: 2em;
      @media (max-width: 767px) {
        margin: 0;
      }

      .jobs-post {
        padding-bottom: 1.5em;
        margin-bottom: 1.5em;
        border-bottom: 1px solid rgba(80, 102, 119, 0.1);
        &:first-child {
          border-top: 1px solid rgba(80, 102, 119, 0.1);
          padding-top: 1.5em;
        }
        @media (max-width: 767px) {
          grid-template-columns: 1fr;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        .job-entry-headers {
          .entry-title {
            display: grid;
            grid-template-columns: 1fr 100px;
            margin-bottom: 0;
            a {
              color: var(--color-primary);
              max-width: 100%;
              &:hover {
                color: var(--color-secondary);
              }
            }
            span {
              white-space: nowrap;
              font-size: 0.7em;
              line-height: 2.5em;
              @media (max-width: 767px) {
                text-align: left;
              }
            }
            @media (max-width: 767px) {
              display: flex;
              flex-direction: column-reverse;
            }
          }
          .entry-sub-title {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
