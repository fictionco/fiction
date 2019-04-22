<template>
  <article class="entry" :class="formatClass">
    <h2>This is a work post entry</h2>
    <div class="entry-wrap">
      <div class="entry-meta">
        <div class="post-author">
          <author-tag v-for="(author) in authors" :key="author.uid" :author="author" />

          <div class="txt">
            <span class="sep">on</span>
            <span class="date">{{ $time.niceFormat(date) }}</span>
            <factor-link
              v-if="$posts.userCanEditPost({uid: this.$uid, post: {authors}})"
              class="edit"
              path="/admin/posts/edit"
              :query="{id: postId}"
            >Edit</factor-link>
          </div>
        </div>
      </div>

      <div class="entry-text">
        <h1 class="entry-header">
          <factor-link :path="path">{{ title }}</factor-link>
        </h1>

        <div class="entry-content">
          <div v-if="format == 'listing'" class="excerpt">{{ $posts.excerpt(content) }}</div>
          <slot v-if="format == 'single'" />
        </div>
      </div>

      <el-tags class="entry-tags" :tags="tags" />

      <div v-if="format == 'listing'" class="entry-action">
        <factor-link size="large" btn="default" :path="path">
          Continue Reading
          <i class="fa fa-arrow-right" />
        </factor-link>
      </div>

      <div v-if="format == 'single'" class="entry-action">
        <div class="share-wrap">
          <factor-link path="/#">
            <i class="fa fa-facebook" />
          </factor-link>
          <factor-link path="/#">
            <i class="fa fa-twitter" />
          </factor-link>
        </div>
      </div>

      <div v-if="format == 'single'" class="post-author post-author-bio">
        <div v-for="(author) in authors" :key="author.uid" class="author-about">
          <factor-avatar :uid="author.uid" :width="'60px'" />
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
    authors: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    date: { type: [String, Number], default: "" },
    path: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    postId: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  },
  computed: {
    formatClass() {
      const f = this.format ? this.format : "single"

      return `format-${f}`
    }
    // postExcerpt() {
    //   let content = this.$markdown.strip(this.content).split(" ")
    //   let excerpt

    //   if (content.length > 30) {
    //     content = content.slice(0, 30)
    //     excerpt = content.join(" ") + "..."
    //   }

    //   return excerpt
    // }
  },
  methods: {}
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
  background: #fff;
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