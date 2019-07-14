<template>
  <article class="aside-entry">
    <div class="format-aside aside-wrap">
      <h2 class="aside-header">
        <factor-link :path="path">{{ title }}</factor-link>
      </h2>

      <div class="aside-sub">
        <div v-if="authors != ''" class="aside-author">
          <div class="post-author">
            <author-tag v-for="(author, ind) in authors.slice(0, 1)" :key="ind" :author="author" />
          </div>
        </div>
        <!-- <div class="aside-meta">
          <div class="date">
            <span class="sep">on</span>
            <span class="date">{{ $time.niceFormat(date) }}</span>
          </div>
          <el-tags :tags="tags" />
        </div>-->
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
    path: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    images: { type: Array, default: () => [] },
    date: { type: [String, Number], default: "" }
  },
  computed: {
    hasBackground() {
      return this.images && this.images.length > 0 ? true : false
    },
    backgroundStyle() {
      return this.hasBackground ? `url(${this.images[0].url})` : ""
    }
  }
}
</script>
<style lang="less">
.aside-entry {
  letter-spacing: -0.03em;

  position: relative;
  background-size: cover;
  background-position: 50%;
  margin-bottom: 0;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  min-width: 0;
  &.no-bg {
    &:hover {
      h2 {
        color: #0496ff;
      }
    }
  }
  &.has-bg {
    //color: #fff;
    // &:after {
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   content: " ";
    //   background-image: linear-gradient(
    //     -126.24deg,
    //     rgba(0, 0, 0, 0.1) 4.42%,
    //     rgba(0, 0, 0, 0.3) 70.27%
    //   );
    //   z-index: 10;
    //   top: 0;
    //   border-radius: 4px;
    // }
    .aside-wrap {
      z-index: 100;
      position: relative;
    }
    &:hover {
      h2 {
        opacity: 0.7;
      }
    }
    .entry-tag {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  &:active {
    transition: 0s;
    box-shadow: none;
    transform: translateY(0);
    h2 {
      color: #ff0076;
    }
  }
  .aside-wrap {
    padding: 40px;
    display: block;
  }

  a {
    color: inherit;
    transition: all 0.2s ease-in-out;
  }

  .aside-header {
    font-weight: 600;
    font-size: 1.4em;
    margin-bottom: 10px;
  }

  .format-aside {
    grid-column: span 1;
  }

  .aside-sub {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .aside-author {
    margin-right: 1em;
  }
  .aside-meta {
    .entry-tags {
      margin-top: 5px;
    }
    .entry-tags a {
      font-size: 12px;
      font-weight: 500;
    }
    .date {
      display: flex;
      font-size: 0.9em;
      font-weight: 600;
      .sep {
        font-weight: 500;
        font-style: italic;
        margin: 0 0.5em 0 0;
        opacity: 0.8;
      }
    }
  }
  .aside-tags,
  .aside-action {
    margin-top: 1em;
  }
}
</style>