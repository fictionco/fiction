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
      <template v-if="posts.length > 0">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="list-item-wrap"
          :class="[post.pinned ? 'pinned': '', post.locked ? 'locked': '']"
        >
          <div class="list-item">
            <factor-link class="item-avatar" :path="topicLink(post)">
              <div class="avatar-area">
                <factor-avatar :post-id="author(post, 'avatar')" />
                <div v-if="post.pinned" class="tag-bubble">
                  <factor-icon icon="fas fa-thumbtack" />
                </div>
                <div v-if="post.locked" class="tag-bubble bottom">
                  <factor-icon icon="fas fa-lock" />
                </div>
              </div>
            </factor-link>
            <div class="item-text">
              <div class="header">
                <h2 class="title">
                  <factor-link :path="topicLink(post)">{{ excerpt(post.title, {length: 16}) }}</factor-link>
                </h2>
                <div class="synopsis">{{ excerpt(post.synopsis) }}</div>
              </div>

              <div class="meta">
                <div class="author meta-item">{{ author(post, 'username') }}</div>
                <div class="time-ago meta-item">Updated {{ timeAgo(post.updatedAt) }}</div>
              </div>
            </div>
            <div class="item-details">
              <div class="number-posts item">
                <factor-icon icon="far fa-comment" />
                <span class="text">{{ (post.embeddedCount || 0) + 1 }}</span>
              </div>
              <component
                :is="setting('forum.components.topicTags')"
                v-if="post.tag.length > 0"
                class="item"
                :tags="post.tag"
              />
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
    loading: { type: Boolean, default: true },
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
    author(this: any, post: FactorPost, field: string) {
      const authorId = post.author && post.author.length > 0 ? post.author[0] : ""
      const author = authorId ? stored(authorId) : {}
      return author && author[field] ? author[field] : undefined
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
    padding: 1rem;
    &.pinned {
      background: var(--color-bg-contrast);
    }
    @media (max-width: 900px) {
      padding: 0.75rem;
    }
  }
  .list-item {
    display: grid;
    grid-template-columns: 3rem minmax(400px, 600px) minmax(100px, 150px);
    grid-template-areas: "avatar text details";
    grid-column-gap: 1.5rem;
    grid-row-gap: 0.5rem;

    .item-avatar {
      grid-area: avatar;
      padding-top: 0.1rem;
      .avatar {
        width: 3rem;
      }
      .avatar-area {
        position: relative;
      }
      .tag-bubble {
        width: 1.25rem;
        height: 1.25rem;
        line-height: 1.25rem;
        text-align: center;
        font-size: 12px;
        position: absolute;
        top: -3px;
        right: -4px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        &.bottom {
          bottom: -3px;
          top: auto;
        }
      }
    }
    .item-text {
      grid-area: text;
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
          @media (max-width: 900px) {
            font-size: 1.1em;
          }
        }
        .synopsis {
          opacity: 0.6;
        }
      }

      .meta {
        display: flex;
        line-height: 1.3;
        .meta-item {
          margin-right: 1rem;
          &.author {
            font-weight: 700;
          }
        }
      }
    }
    .item-details {
      grid-area: details;
      text-align: right;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
      .item {
        min-width: 0;
      }
      .number-posts {
        .text {
          margin-left: 0.25em;
        }
      }
    }
    @media (max-width: 900px) {
      grid-template-columns: 3rem 1fr minmax(2.5rem, 4rem);
      grid-template-areas: "avatar text details";
      .item-details {
        text-align: right;
        grid-template-columns: 1fr;
        .tags {
          display: none;
        }
      }
      .item-text {
        .meta {
          font-size: 0.85em;
          flex-direction: column;
          .author {
            display: none;
          }
        }
      }
    }
  }
}
</style>
