<template>
  <article class="entry" :class="formatClass">
    <factor-link :path="path">
      <div
        class="img-wrap"
        :style="{'background-image': `url(`+ require(`../img/test.jpg`) + `)` }"
      />
      {{ image.url }}
    </factor-link>

    <div class="entry-wrap">
      <div class="entry-text">
        <h1 class="title">
          <factor-link :path="path">{{ title }}</factor-link>
        </h1>

        <el-tags class="tags" :tags="tags" />

        <div class="content">
          <slot v-if="format == 'single'" />
        </div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  components: {
    "el-tags": () => import("./tags")
  },
  props: {
    format: { type: String, default: "" },
    image: { type: String, default: "" },
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
  margin-bottom: 0;
  transition: all 0.2s ease-in-out;
  //font-weight: 500;
  // min-width: 0;
  //background: #fff;
  .entry-wrap {
    //padding: 30px;
    display: block;
  }
  a {
    transition: all 0.2s ease-in-out;
  }

  .title {
    font-weight: 600;
    font-size: 2.5em;
    line-height: 1.1;
    margin: 0.5em 0;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: inherit;
      &:hover,
      &:active {
        color: @color-primary;
      }
    }
  }
  .content {
    margin: 0 0 1em 0;
    font-size: 1.5em;
    line-height: 1.4em;
    @media (max-width: 767px) {
      font-size: 1em;
    }
  }
  .tags {
    margin-top: 1em;
  }

  &.format-listing {
    text-align: center;

    .img-wrap {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 550px;
      margin-bottom: 1em;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
      &:hover {
        transform: scale(0.95);
      }
    }
    .title {
      font-weight: 600;
      font-size: 2em;
      line-height: 1.1;
    }
    .category {
      opacity: 0.5;
    }
  }
  // .entry-action {
  //   padding: 1.5em 0;
  // }

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

  // .post-author {
  //   display: flex;
  //   @media (max-width: 767px) {
  //     flex-direction: column;
  //   }

  //   .txt {
  //     display: flex;
  //     align-items: center;
  //     font-size: 0.9em;
  //     font-weight: 600;
  //     .sep {
  //       font-weight: 500;
  //       font-style: italic;
  //       margin: 0 1em 0 0;
  //       opacity: 0.8;
  //     }
  //     .edit {
  //       margin-left: 1em;
  //     }
  //   }
  // }
}
</style>