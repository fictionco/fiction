<template>
  <div class="entry-header">
    <div class="header-top blog-hero">
      <div class="inner">
        <component :is="setting('blog.components.returnLink')" :post-id="postId" />
        <h1 class="title">
          <factor-link :path="postLink(post._id)" class="headline">{{
            post.title
          }}</factor-link>
        </h1>

        <h3 class="hero-content">{{ post.synopsis }}</h3>

        <factor-post-edit :post-id="post._id" />
      </div>
    </div>
    <div class="meta-wrap">
      <div class="mast">
        <div class="meta">
          <span class="date">{{ standardDate(post.date) }}</span>
          <div v-for="authorId in post.author" :key="authorId" class="author">
            <factor-avatar :user="getPost(authorId)" />
            <span
              class="name"
              itemprop="author"
              itemscope
              itemtype="http://schema.org/Person"
              >{{ getPost(authorId).displayName }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink, factorAvatar } from "@factor/ui"
import { postLink, standardDate, setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorAvatar, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    avatar(this: any) {
      return stored(this.post.avatar) || {}
    },
    avatarUrl(this: any) {
      return this.avatar.url || ""
    },
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    },
    postLink,
    setting,
    standardDate,
  },
})
</script>
<style lang="less">
.plugin-blog {
  .avatar {
    .thumb {
      border-radius: 50%;
    }
  }
  .single-entry .entry-header {
    .mast {
      max-width: 1000px;
      margin: 0 auto;
    }

    .blog-hero {
      background-image: url("../img/dot.svg");

      // Dark version
      // background-color: #1b223c;
      // background-image: url("../img/dot-light.svg");
      text-align: center;

      .inner {
        max-width: 48rem;
        margin: 0 auto;
        padding: 2rem;
      }

      .return-link {
        margin-bottom: 1rem;
        padding-top: 1.5rem;
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1.25;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      // .title .headline,
      // .subheadline,
      // .hero-content {
      //   color: #f3f4fa;
      // }
      .title {
        padding-top: 0.5rem;
        font-size: 3rem;
        letter-spacing: -0.025em;
        line-height: 1.25;
        font-weight: var(--font-weight-bold, 700);
        a {
          //color: #f3f4fa;
          color: var(--color-text);
          &:hover {
            color: var(--color-primary);
          }
        }

        @media (max-width: 767px) {
          font-size: 1.875rem;
        }
      }
      .edit {
        display: block;
        color: var(--color-primary);
      }
      .subheadline {
        opacity: 0.5;
      }
      .hero-content {
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        font-weight: normal;
        opacity: 0.7;
      }
    }

    .meta-wrap {
      .meta {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding-top: 1rem;
        padding-bottom: 1rem;

        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1.25;
        letter-spacing: 0.1em;
        text-transform: uppercase;

        .date {
          display: inline-block;
        }
        .author {
          display: flex;
          justify-content: center;
          align-items: center;
          .avatar {
            width: 2rem;
            margin-left: 2rem;
          }
          .name {
            margin-left: 0.5rem;
            margin-bottom: 0;
          }
        }
      }
    }

    .featured-image-wrap {
      max-width: 56rem;
      margin: 3rem auto;
      img {
        width: 100%;
      }
      @media (max-width: 767px) {
        margin: 0 0 3rem;
      }
    }
  }
}
</style>
