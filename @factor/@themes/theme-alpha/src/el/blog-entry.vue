<template>
  <article class="entry">
    <div class="entry-wrap">
      <img v-if="images" class="entry-image" :src="images" :alt="title" >

      <el-tags class="entry-tags" :tags="tags" />

      <div class="entry-text">
        <h1 class="entry-header">
          <app-link :path="path">{{ title }}</app-link>
        </h1>

        <div class="entry-content">
          <div v-if="format == 'listing'" class="excerpt">{{ $posts.excerpt(content) }}</div>
          <slot v-if="format == 'single'" />
        </div>
      </div>

      <div class="entry-meta">
        <div class="post-author">
          <div class="txt">
            <span class="date">{{ $time.niceFormat(date) }}</span>
          </div>
          <author-tag v-for="(author) in author" :key="author._id" :author="author" />
        </div>
      </div>

      <div v-if="format == 'listing'" class="entry-action">
        <app-link size="standard" btn="default" :path="path">
          Continue Reading
          <factor-icon icon="arrow-right" />
        </app-link>
      </div>

      <div v-if="format == 'single'" class="entry-action">
        <div class="share-wrap">
          <app-link path="https://www.facebook.com/">
            <factor-icon icon="facebook" />
          </app-link>
          <app-link path="https://twitter.com/">
            <factor-icon icon="twitter" />
          </app-link>
        </div>
      </div>

      <div v-if="format == 'single'" class="post-author post-author-bio">
        <div v-for="(author) in author" :key="author._id" class="author-about">
          <factor-avatar :post-id="author._id" :width="'60px'" />
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
    images: { type: String, default: "" },
    author: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    date: { type: [String, Number], default: "" },
    path: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    postId: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  }
  // computed: {
  // formatClass() {
  //   const f = this.format ? this.format : "single"
  //   return `format-${f}`
  // }
  // postExcerpt() {
  //   let content = this.$markdown.strip(this.content).split(" ")
  //   let excerpt
  //   if (content.length > 30) {
  //     content = content.slice(0, 30)
  //     excerpt = content.join(" ") + "..."
  //   }
  //   return excerpt
  // }
  // },
  // methods: {}
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

.page-blog {
  .entry {
    min-width: 0;
    letter-spacing: -0.03em;
    font-weight: 500;
    color: var(--color-text);
    background: var(--color-white);

    .entry-image {
      width: 100%;
    }
    .entry-header {
      font-weight: 600;
      font-size: 2em;
      line-height: 1.1;
      margin: 0.5em 0;
    }
    .entry-content {
      margin: 0 0 1em 0;
      font-size: 1.2em;
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
      }
    }
  }
}
</style>