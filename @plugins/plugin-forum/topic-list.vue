<template>
  <div class="thread-index">
    <div class="thread-index-controls">
      <div class="filters">
        <factor-input-select
          placeholder="Order By"
          :list="['latest', 'popular']"
          :value="$route.query.order || 'latest'"
          @input="setQuery({key: 'order', value: $event, init: 'latest'})"
        />
        <factor-input-select
          v-if="$route.query.order == 'popular'"
          placeholder="Time"
          :list="['day', 'week', 'month', 'year', 'all-time']"
          :value="$route.query.time || 'week'"
          @input="setQuery({key: 'time', value: $event, init: 'week'})"
        />
      </div>
      <div class="discovery">
        <factor-input-text
          placeholder="Search"
          @keyup.enter="setQuery({key: 'search', value: $event.target.value.trim()})"
        />
      </div>
    </div>
    <div v-if="breadcrumb" class="breadcrumb">
      <div v-formatted-text="breadcrumb" class="notification" />
    </div>
    <div class="list-items">
      <factor-loading-ring v-if="loading" />
      <template v-else-if="posts.length > 0">
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
              <div class="number-posts item">
                <factor-icon icon="far fa-comment" />
                <span class="text">{{ (post.embeddedCount || 0) + 1 }}</span>
              </div>
              <component :is="setting('forum.components.topicTags')" :tags="post.tag" />
            </div>
          </div>
        </div>
        <component :is="setting('forum.components.topicPagination')" />
      </template>
      <div v-else class="no-posts">
        <div class="title">Nothing Found</div>
        <div class="actions">
          <factor-link
            btn="primary"
            :path="`${setting('forum.indexRoute')}/add-new`"
          >Start A Discussion</factor-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  factorLoadingRing,
  factorIcon,
  factorLink,
  factorAvatar,
  factorInputSelect,
  factorInputText
} from "@factor/ui"
import { excerpt } from "@factor/api/excerpt"
import { timeAgo } from "@factor/api/time"
import { stored, toLabel } from "@factor/api"
import { setting } from "@factor/api/settings"
import { FactorPost } from "@factor/post/types"

import Vue from "vue"
import { topicLink } from "./request"

export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    factorAvatar,
    factorIcon,
    factorInputSelect,
    factorInputText
  },
  props: {
    loading: { type: Boolean, default: false },
    posts: { type: Array, default: () => [] }
  },
  data() {
    return {}
  },
  computed: {
    breadcrumb(this: any): string {
      let out = ""
      const query = this.$route.query
      if (query.search) {
        out = `Search results for "${query.search}"`
      } else if (query.tag) {
        out = `Viewing tag "${query.tag}"`
      } else if (query.category) {
        out = `Viewing category "${query.category}"`
      }
      return out
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
    },
    setQuery(
      this: any,
      { key, value, init }: { key: string; value: string; init: string }
    ): void {
      let query = Object.assign({}, this.$route.query)
      if (!value || value == init) {
        delete query[key]
      } else {
        query = { ...query, [key]: value }
      }
      this.$router.push({ query })
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
    .filters select {
      margin-right: 1rem;
    }
  }
  .breadcrumb {
    padding: 0.5rem 0 2rem;
    .notification {
      font-weight: 700;
      opacity: 0.4;
      padding: 0.25rem 0.5rem;
    }
  }
  .list-items {
    .loading-ring-wrap {
      margin: 3em 0;
    }
    .no-posts {
      padding: 8em 2em;
      display: flex;

      align-items: center;
      justify-content: center;
      flex-direction: column;
      .title {
        font-size: 1.4em;
        opacity: 0.2;
        font-weight: 700;
      }
      .actions {
        margin-top: 2em;
      }
    }
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

      .number-posts {
        font-size: 1.2em;
        font-weight: 800;
        .text {
          margin-left: 0.25em;
        }
      }
    }
  }
}
</style>
