<template>
  <article class="entry" :class="formatClass">
    <div class="entry-wrap">
      <div class="entry-meta">
        <div class="post-author">
          <author-tag v-for="(author) in post.author" :key="author._id" :post-id="author" />

          <div class="txt">
            <span class="sep">on</span>
            <span class="date">{{ $time.niceFormat(post.date) }}</span>
            <factor-post-edit :post-id="post._id" />
          </div>
        </div>
      </div>

      <div class="entry-text">
        <h1 class="entry-header">
          <factor-link :path="$posts.link(post._id)">{{ post.title }}</factor-link>
        </h1>

        <div class="entry-content">
          <div v-if="format == 'listing'" class="excerpt">{{ $posts.excerpt(post.content) }}</div>
          <div v-else-if="format == 'single'" v-formatted-text="$markdown.render(post.content)" />

          <div v-if="format == 'listing'" class="entry-read-more">
            <factor-link :path="$posts.link(post._id)">
              Continue Reading
              <factor-icon icon="arrow-right" />
            </factor-link>
          </div>
        </div>
      </div>

      <el-tags class="entry-tags" :tags="post.tag" />

      <div v-if="format == 'single'" class="entry-action">
        <div class="share-wrap">
          <factor-link
            class="facebook"
            btn="default"
            :path="`https://www.facebook.com/sharer/sharer.php?u=${$posts.link(post._id, {root: true})}`"
          >
            <factor-icon icon="facebook" />
          </factor-link>
          <factor-link
            class="twitter"
            btn="default"
            :path="`https://twitter.com/home?status=${$posts.link(post._id, {root: true})}`"
          >
            <factor-icon icon="twitter" />
          </factor-link>
          <factor-link
            class="linkedin"
            btn="default"
            :path="`https://www.linkedin.com/shareArticle?mini=true&url=${$posts.link(post._id, {root: true})}`"
          >
            <factor-icon icon="linkedin" />
          </factor-link>
          <factor-link
            class="pinterest"
            btn="default"
            :path="`https://pinterest.com/pin/create/button/?url=${$posts.link(post._id, {root: true})}`"
          >
            <factor-icon icon="pinterest" />
          </factor-link>
        </div>
      </div>

      <div v-if="format == 'single'" class="post-author post-author-bio">
        <div v-for="(author) in post.author" :key="author._id" class="author-about">
          <factor-avatar :post-id="author._id" width="3em" />
          <div class="text">
            <span class="name">{{ author.displayName }}</span>
            <div class="bio">{{ author.bio }}</div>
            {{ author.link }}
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  components: {
    "el-tags": () => import("./tags"),
    "author-tag": () => import("./author-tag")
  },
  props: {
    format: { type: String, default: "" },
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    formatClass() {
      const f = this.format ? this.format : "single"

      return `format-${f}`
    }
  }
}
</script>
<style lang="less">
.entry {
  margin-bottom: 0;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  min-width: 0;
  .entry-wrap {
    padding: 30px;
    display: block;
  }
  a {
    transition: all 0.2s ease-in-out;
  }

  .entry-header {
    font-weight: var(--font-weight-bold);
    font-size: 2.5em;
    line-height: 1.1;
    margin: 1rem 0;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: inherit;
      &:hover {
        color: var(--color-primary);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }
  .entry-content {
    font-size: 1.25em;
    line-height: 1.4em;
    @media (max-width: 767px) {
      font-size: 1em;
    }
    padding-bottom: 1rem;
  }
  .entry-read-more {
    margin-top: 1rem;
  }
  .entry-action {
    .share-wrap {
      .btn-link {
        margin-right: 0.5em;
        font-size: 1.1em;
        line-height: 1;
        color: #fff;
        padding: 0.5em 0.75em;
        border-radius: 5px;
        width: 3em;
        text-align: center;
        &.facebook {
          background: #1877f2;
        }
        &.twitter {
          background: #1da1f2;
        }
        &.linkedin {
          background: #007bb5;
        }
        &.pinterest {
          background: #bd081c;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  .author-about {
    display: flex;
    font-size: 1.3em;
    line-height: 1.4;
    margin: 1.5em 0;
    .name {
      font-size: 1.2em;
      font-weight: 600;
    }
    .bio {
      opacity: 0.6;
    }
    .avatar {
      margin-right: 1em;
    }
  }

  .post-author {
    display: flex;
    @media (max-width: 767px) {
      flex-direction: column;
    }

    .txt {
      display: flex;
      align-items: center;
      font-size: 0.9em;
      font-weight: var(--font-weight-bold);
      .sep {
        font-weight: 500;
        font-style: italic;
        margin: 0 1em 0 0;
        opacity: 0.8;
      }
      .edit {
        margin-left: 1em;
      }
    }
  }
  .entry-tags {
    margin-top: 1em;
  }
}
</style>