<template>
  <div class="view-careers">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="label label-pink">Careers</div>
        <h1 class="title">Let's Create Something Beautiful Together</h1>
        <p
          class="subtitle"
        >Fiction is on a mission to help frontend developers create better Javascript apps.</p>
        <a href="#current-openings">
          <factor-btn path="#current-openings" btn="quaternary" size="large">
            Check Our Current Openings
            <factor-icon icon="arrow-down" />
          </factor-btn>
        </a>
      </div>
    </section>

    <section class="boxes-wrap">
      <div class="mast">
        <div class="boxes-inner">
          <h2 class="title">Values</h2>
          <div class="boxes">
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Enterprise Factor Platform</h3>
                <p
                  class="box-description"
                >VIP is a fully managed Factor cloud platform for unparalleled scale, security, flexibility, and performance.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Implementation &amp; Support</h3>
                <p
                  class="box-description"
                >End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Build Your Digital Experiences</h3>
                <p
                  class="box-description"
                >Solutions at the ready. Factor powers mission critical enterprise media and marketing systems.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">A Complete Solution</h3>
                <p
                  class="box-description"
                >Ready models, processes, and plugins to deliver your business goals. Deep, extensible capabilities.</p>
              </div>
            </div>
          </div>
        </div>
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
            <div v-for="(post) in jobsPosts" :key="post._id" class="jobs-post">
              <div>
                <img
                  :src="getPost(post.jobIcon).url || require(`./img/icon-default.svg`)"
                  class="jobs-post-icon"
                />
              </div>
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
<script>
import { setting } from "@factor/tools"
import { requestPostIndex } from "@factor/post"
export default {
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
      return this.$store.val(this.postType) || {}
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
      handler: function(to) {
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
      return this.$store.val(_id) || {}
    },
    async getPosts() {
      this.loading = true

      const r = await requestPostIndex({
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
}
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
      padding: 6em 0 12em;
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

  // Values
  .boxes-wrap {
    background-color: #f5f8fc;
    .boxes-inner {
      box-shadow: var(--box-shadow-panel);
      background: var(--color-light);
      border-radius: 0.5em;
      padding: 3em;
      position: relative;
      transform: translateY(-80px);

      @media (max-width: 767px) {
        padding: 1em;
      }

      .title {
        font-size: 2.5em;
        font-weight: var(--font-weight-bold);
        padding-bottom: 1em;
      }

      .boxes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 60px 30px;

        .box {
          display: grid;
          grid-template-columns: 40px 1fr;
          .fa {
            font-size: 22px;
            color: var(--color-secondary);
          }
          .box-title {
            font-size: 1.4em;
            font-weight: var(--font-weight-bold);
            letter-spacing: -0.03em;
            margin-bottom: 0.5em;
          }
          .box-description,
          a {
            font-size: 1.2em;
            line-height: 1.6em;
          }
          .box-description {
            font-weight: var(--font-weight-normal, 400);
            opacity: 0.7;
          }
        }
        @media (max-width: 767px) {
          grid-template-columns: 1fr;
          transform: translateY(0);
          .box {
            padding: 0;
          }
        }
      }
    }
  }

  // Careers
  .careers {
    position: relative;
    padding: 3em 0;
    .title {
      font-size: 2.5em;
      font-weight: var(--font-weight-bold);
    }
    .careers-inner {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: left;
      max-width: 700px;
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
      margin-top: 3em;

      .jobs-post {
        display: grid;
        grid-template-columns: 80px 1fr;
        border-bottom: 1px solid rgba(80, 102, 119, 0.1);
        padding-bottom: 2em;
        margin-bottom: 2em;
        @media (max-width: 767px) {
          grid-template-columns: 1fr;
        }
        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }
        .jobs-post-icon {
          width: 30px;
          height: auto;
        }
        p {
          font-size: 1.2em;
          font-weight: var(--font-weight-normal, 400);
          line-height: 1.6em;
          margin-bottom: 1em;
          opacity: 0.7;
          @media (max-width: 767px) {
            clear: both;
          }
        }
      }

      .jobs-post {
        margin: 4rem 0;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>