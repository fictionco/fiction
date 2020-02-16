<template>
  <div class="thread-index">
    <div class="thread-index-controls">
      <div class="filters">
        <factor-input-select placeholder="Sort" :list="['latest', 'popular']" :value="filterValue" />
      </div>
      <div class="discovery">
        <factor-input-text placeholder="Search" :list="[]" />
      </div>
    </div>
    <div class="thead-list-item">
      <div v-for="(post, index) in posts" :key="index" class="list-item-wrap">
        <div class="list-item">
          <factor-link class="item-avatar" :path="topicLink(post)">
            <factor-avatar :post-id="author(post).avatar" />
          </factor-link>
          <div class="item-text">
            <div class="header">
              <h2 class="title">
                <factor-link :path="topicLink(post)">{{ excerpt(post.title, {length: 16}) }}</factor-link>
              </h2>
              <div class="synopsis">{{ excerpt(post.synopsis) }}</div>
            </div>

            <div class="meta">
              <div class="author meta-item">{{ author(post).username }}</div>
              <div class="time-ago meta-item">Updated {{ timeAgo(post.updatedAt) }}</div>
            </div>
          </div>
          <div class="item-details">
            <component :is="setting('forum.components.topicNumberPosts')" />
            <component :is="setting('forum.components.topicTags')" :tags="post.category" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { excerpt } from "@factor/api/excerpt"
import { timeAgo } from "@factor/api/time"
import { stored, toLabel } from "@factor/api"
import { setting } from "@factor/api/settings"
import { FactorPost } from "@factor/post/types"
import {
  factorIcon,
  factorLink,
  factorAvatar,
  factorInputSelect,
  factorInputText
} from "@factor/ui"
import Vue from "vue"
import { topicLink } from "./request"

export default Vue.extend({
  components: {
    factorLink,
    factorAvatar,
    factorIcon,
    factorInputSelect,
    factorInputText
  },
  props: {
    posts: { type: Array, default: () => [] }
  },
  data() {
    return {
      filterValue: "latest"
    }
  },
  methods: {
    timeAgo,
    toLabel,
    setting,
    topicLink,
    excerpt,
    author(this: any, post: FactorPost) {
      return post.author && post.author.length > 0 ? stored(post.author[0]) : {}
    }
  }
})
</script>

<style lang="less">
.thread-index {
  .thread-index-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  .list-item-wrap {
    margin-bottom: 2rem;
  }
  .list-item {
    display: grid;
    grid-template-columns: 3rem minmax(400px, 600px) minmax(100px, 150px);
    grid-gap: 1.5rem;
    .item-avatar {
      padding-top: 0.1rem;
      .avatar {
        width: 3rem;
      }
    }
    .item-text {
      .header {
        margin-bottom: 0.25rem;
        .title {
          font-size: 1.5em;
          line-height: 1.2;
          font-weight: var(--font-weight-bold, 700);
          letter-spacing: -0.02em;
          a {
            color: inherit;
            &:hover {
              color: var(--color-primary);
            }
          }
        }
        .synopsis {
          opacity: 0.6;
        }
      }

      .meta {
        display: flex;
        .meta-item {
          margin-right: 1rem;
          &.author {
            font-weight: 700;
          }
        }
      }
    }
    .item-details {
      text-align: right;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
      grid-auto-rows: min-content;
      // .tags {
      //   .tag {
      //     border-radius: 5px;
      //     padding: 0 0.5rem;
      //     display: inline-block;
      //     margin: 0 1rem 0.5rem 0;
      //     background: var(--color-bg-contrast);
      //   }
      // }
      // .number-comments {
      //   .factor-icon {
      //     margin-right: 0.5rem;
      //   }
      // }
    }
  }
}
</style>
