<template>
  <article class="entry" :class="formatClass">
    <div class="entry-wrap">
      <slot name="before-entry" />
      <div class="entry-meta">
        <meta-author v-for="authorId in post.author" :key="authorId" :post-id="authorId" />

        <div class="txt">
          <span class="sep">on</span>
          <span class="date">{{ $time.niceFormat(post.date) }}</span>
          <factor-post-edit :post-id="post._id" />
        </div>
      </div>

      <div class="entry-text">
        <h1 class="entry-header">
          <factor-link :path="$posts.link(post._id)">{{ post.title }}</factor-link>
        </h1>

        <slot name="after-title" />

        <div class="entry-content">
          <div v-if="format == 'listing'" class="excerpt">
            {{ $posts.excerpt(post.content) }}
            <factor-link class="read-link" :path="$posts.link(post._id)">
              Read
              <factor-icon icon="arrow-right" />
            </factor-link>
          </div>
          <highlight-code v-else-if="format == 'single'">
            <div v-formatted-text="$markdown.render(post.content)" />
          </highlight-code>
        </div>
      </div>

      <widget-post-tags class="entry-tags" :tags="post.tag" />
      <slot name="after-entry" />
    </div>
  </article>
</template>
<script>
export default {
  components: {
    "meta-author": () => import("./meta-author"),
    "widget-post-tags": () => import("./widget-post-tags"),
    "highlight-code": () =>
      import("@factor/plugin-highlight-code/highlight-code")
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
  a {
    transition: all 0.2s ease-in-out;
  }
  .entry-wrap {
    padding: 30px;
    display: block;
  }

  .entry-meta {
    display: flex;
    align-items: center;
    margin-right: 1em;
    padding: 0.3em 0;

    .avatar {
      display: block;
      margin-right: 10px;
      float: left;
    }
    .name {
      font-weight: var(--font-weight-bold);
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
  .read-link {
    margin-left: 1rem;
  }

  // .author-about {
  //   display: flex;
  //   font-size: 1.3em;
  //   line-height: 1.4;
  //   margin: 1.5em 0;
  //   .name {
  //     font-size: 1.2em;
  //     font-weight: 600;
  //   }
  //   .bio {
  //     opacity: 0.6;
  //   }
  //   .avatar {
  //     margin-right: 1em;
  //   }
  // }

  .entry-tags {
    margin-top: 1.5rem;
  }
}
</style>