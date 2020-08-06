<template>
  <div class="view-careers">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="page-sup">Careers</div>
        <h1 class="page-title">Let's Create Something Beautiful Together</h1>
        <p class="page-subtitle">
          Factor is on a mission to help frontend developers create better JavaScript
          apps.
        </p>
      </div>
    </section>

    <section id="current-openings" class="careers-wrap">
      <div class="mast careers-inner">
        <h1 class="title">Check Our Current Openings</h1>
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
.view-careers {
  .mast {
    padding: 0 1.5em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .splash-wrap {
    margin: 7em 0 3rem;

    @media (max-width: 767px) {
      margin: 6em 0;
      text-align: left;
    }

    .splash {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      text-align: center;
      max-width: 50rem;

      @media (max-width: 767px) {
        text-align: left;
      }
      .page-sup {
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-text-secondary);
      }
      .page-title {
        font-size: 3.2em;
        letter-spacing: -0.025em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;

        @media (max-width: 767px) {
          font-size: 2em;
          line-height: 1.3;
        }
      }
      .page-subtitle {
        margin: 0 auto;
        max-width: 40ch;
        font-size: 1.75em;
        font-weight: 400;
        color: var(--color-text-secondary);
        letter-spacing: -0.025em;

        @media (max-width: 767px) {
          margin: 0;
          font-size: 1.4em;
          line-height: 1.4;
        }
      }
    }
  }
  // Careers
  .careers-wrap {
    .careers-inner {
      max-width: 48rem;
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    .title {
      text-align: center;
      font-size: 1.6rem;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
      @media (max-width: 900px) {
        font-size: 1.4em;
      }
    }
  }
  .jobs-entries {
    .post-index {
      .jobs-post {
        display: block;
        margin-bottom: 2rem;
        padding: 1.5rem;
        text-align: left;
        border-radius: 8px;
        color: var(--color-text-secondary);
        transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);

        &:hover {
          opacity: 1;
          color: var(--color-text);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 900px) {
          grid-template-columns: 1fr;
        }
      }
    }
    .pagination {
      .factor-btn {
        box-shadow: none;
      }
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
        font-weight: 700;
      }
    }
    @media (max-width: 767px) {
      padding: 0;
    }
  }
}
</style>
