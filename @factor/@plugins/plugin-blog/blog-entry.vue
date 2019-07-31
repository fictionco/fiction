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
          <slot v-if="format == 'single'" />
          <div v-if="format == 'listing'" class="entry-action">
            <factor-link :path="$posts.link(post._id)">
              Continue Reading
              <factor-icon icon="arrow-right" />
            </factor-link>
          </div>
        </div>
      </div>

      <el-tags class="entry-tags" :tags="post.tag" />

      <div v-if="format == 'single'" class="entry-action">
        <el-flame :post-id="postId" />

        <div class="share-wrap">
          <factor-link path="/#">
            <factor-icon icon="facebook" />
          </factor-link>
          <factor-link path="/#">
            <factor-icon icon="twitter" />
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
    "el-flame": () => import("./flame"),
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
.ghost {
  > div {
    background-color: #f7f9ff;
    height: 2em;
    margin: 0.5em 0;
    border-radius: 8px;
    &:last-child {
      width: 75%;
      margin-bottom: 2em;
    }
  }
}
.entry {
  letter-spacing: -0.03em;

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
    font-weight: 600;
    font-size: 2.5em;
    line-height: 1.1;
    margin: 0.5em 0;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: inherit;
      &:hover {
        color: #0496ff;
      }
      &:active {
        color: #ff0076;
      }
    }
  }
  .entry-content {
    margin: 0 0 1em 0;
    font-size: 1.5em;
    line-height: 1.4em;
    @media (max-width: 767px) {
      font-size: 1em;
    }
  }
  .entry-action {
    padding: 1.5em 0;
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
      font-weight: 600;
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