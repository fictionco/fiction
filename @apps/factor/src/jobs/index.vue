<template>
  <div class="view-careers">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="label label-secondary">Careers</div>
        <h1 class="title">Let's Create Something Beautiful Together</h1>
        <p class="subtitle">
          Fiction is on a mission to help frontend developers create better JavaScript
          apps.
        </p>
        <a href="#current-openings">
          <factor-btn path="#current-openings" btn="primary" size="large" class="see-openings">
            Check Our Current Openings
            <factor-icon icon="fas fa-arrow-down" />
          </factor-btn>
        </a>
      </div>
    </section>

    <section id="current-openings" class="careers">
      <div class="mast careers-inner">
        <h1 class="title">Current Job Openings</h1>
        <div class="jobs-entries">
          <div v-if="loading" class="posts-loading">
            <factor-spinner />
          </div>

          <div v-else-if="jobsPosts.length > 0" class="post-index">
            <factor-link
              v-for="post in jobsPosts"
              :key="post._id"
              :path="postLink(post._id)"
              class="jobs-post"
            >
              <component
                :is="setting(`jobs.components.${comp}`)"
                v-for="(comp, i) in setting('jobs.layout.index')"
                :key="i"
                :post-id="post._id"
              />
            </factor-link>
          </div>

          <div v-else class="posts-not-found">
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
import { factorBtn, factorLink, factorSpinner, factorIcon } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
export default {
  components: { factorBtn, factorLink, factorSpinner, factorIcon },
  data() {
    return {
      postType: "jobs",
      loading: false,
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("jobs.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("jobs.metatags.index.description")

    return {
      title,
      description,
    }
  },
  // routeClass() {
  //   return "nav-white"
  // },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    tag(this: any) {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index(this: any) {
      return stored(this.postType) || {}
    },
    jobsPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    postLink,
    setting,
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("jobs.limit"),
      })

      this.loading = false
    },
  },
}
</script>

<style lang="less">
.careers {
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
      font-weight: 700;
      margin-bottom: 1rem;

      &.label-secondary {
        color: var(--color-text-secondary);
      }
    }

    .splash-wrap {
      // background-image: url(./img/world-left.svg), url(./img/world-right.svg);
      // background-position: left -100px center, right -600px center;
      // background-repeat: no-repeat;
      // background-size: contain;
      // @media (max-width: 767px) {
      //   background-position: left -300px center, right -600px center;
      //   button.app-btn.large {
      //     font-size: 1em;
      //   }
      // }
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
          font-size: 4em;
          letter-spacing: -0.025em;
          line-height: 1.1;
          font-weight: 700;
          margin-bottom: 1rem;

          @media (max-width: 767px) {
            font-size: 2em;
            line-height: 1.3;
          }
        }
        .subtitle {
          margin: 0 auto 1.5em;
          max-width: 40ch;
          font-size: 1.75em;
          font-weight: 400;
          color: var(--color-text-secondary);
          letter-spacing: -0.025em;

          @media (max-width: 767px) {
            margin: 0 0 1.5em;
            font-size: 1.4em;
            line-height: 1.4;
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
        border-radius: 8px;
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
    .jobs-entries {
      .post-index {
        margin-top: 2em;
        .jobs-post {
          display: block;
          margin-bottom: 2rem;
          padding: 1.5rem;
          text-align: left;
          border-radius: 8px;
          color: var(--color-text);
          transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 0.2rem 0.5rem rgba(103, 110, 144, 0.2),
            0 0 0 0.1rem rgba(103, 110, 144, 0.05);

          &:hover {
            opacity: 1;
            color: var(--color-primary);
            box-shadow: 0 0.2rem 0.5rem rgba(103, 110, 144, 0.4),
              0 0 0 0.1rem rgba(103, 110, 144, 0.05);
          }
          @media (max-width: 767px) {
            grid-template-columns: 1fr;
          }
        }
      }
      .pagination {
        @media (max-width: 767px) {
          margin-top: 1.5em;
        }
      }
      .posts-not-found,
      .posts-loading {
        min-height: 50vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        .title {
          font-size: 1.4em;
          font-weight: 600;
        }
      }
      @media (max-width: 767px) {
        padding: 0;
      }
    }
  }
}
</style>
