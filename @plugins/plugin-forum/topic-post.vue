<template>
  <div class="topic-post">
    <div class="post-avatar">
      <factor-avatar :user="author" />
    </div>
    <div class="post-content">
      <div class="post-meta">
        <factor-avatar class="avatar meta-item" :user="author" />
        <div class="author meta-item">{{ author.username }}</div>
        <div class="time meta-item">{{ timeAgo(post.createdAt) }}</div>

        <factor-menu
          v-if="!loading && actions.length > 0"
          :list="actions"
          @action="handleAction($event)"
        />
      </div>
      <div class="post-text">
        <div v-formatted-text="rendered" />
      </div>
      <div class="post-footer">
        <div class="actions">
          <div
            v-for="(action, i) in actions"
            :key="i"
            size="small"
            class="post-action"
            @click="handleAction(action)"
          >{{ toLabel(action) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { renderMarkdown } from "@factor/api/markdown"
import { factorAvatar, factorMenu } from "@factor/ui"
import { isEmpty, setting, stored, storeItem, toLabel } from "@factor/api"
import { timeAgo } from "@factor/api/time"
import { currentUser, userCan, userInitialized } from "@factor/user"

import { FactorPost } from "@factor/post/types"
import { PostActions } from "./request"
export default {
  components: { factorAvatar, factorMenu },
  props: {
    postId: { type: String, default: "" },
    parentId: { type: String, default: "" },
  },

  data() {
    return {
      loading: true,
      running: false,
    }
  },

  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      },
    },
    currentUser,
    rendered(this: any) {
      return renderMarkdown(this.post.content)
    },
    author(this: any) {
      const authorId =
        this.post.author && this.post.author.length > 0 ? this.post.author[0] : ""
      return this.getPost(authorId) || {}
    },
    actions(this: any): PostActions[] {
      const actions = []
      if (this.postId == this.parentId && this.currentUser?.accessLevel >= 200) {
        actions.push(
          ...[
            this.post.pinned ? PostActions.Unpin : PostActions.Pin,
            this.post.locked ? PostActions.Unlock : PostActions.Lock,
          ]
        )
      }

      if (userCan({ accessLevel: 200, post: this.post })) {
        actions.push(...[PostActions.Edit, PostActions.Delete])
      }

      return actions
    },
  },
  async mounted() {
    await userInitialized()
    this.loading = false
  },

  methods: {
    isEmpty,
    setting,
    timeAgo,
    toLabel,

    focusReply() {
      const el: HTMLFormElement | null = document.querySelector("#topic-reply")
      if (el) {
        el.focus()
      }
    },
    getPost(_id: any) {
      return stored(_id) || {}
    },
    async handleAction(this: any, action: PostActions) {
      let value = true
      if (action == PostActions.Unpin || action == PostActions.Pin) {
        value = action == PostActions.Unpin ? false : true
        this.post = { ...this.post, pinned: value }
      } else if (action == PostActions.Unlock || action == PostActions.Lock) {
        value = action == PostActions.Unlock ? false : true
        this.post = { ...this.post, locked: value }
      }
      this.$emit("action", action, value)
    },
  },
}
</script>
<style lang="less">
.topic-post {
  @import "~@factor/ui/css/standard-entry.less";
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  grid-gap: 2rem;
  margin: 2rem 0;

  position: relative;
  figure {
    text-align: left;
    figcaption {
      text-align: left;
    }
  }
  .post-content {
    position: relative;
    min-width: 0;
    border-radius: 5px;

    box-shadow: var(--forum-panel-shadow);

    .post-text {
      padding: 1rem;
    }
  }
  &:last-child {
    border-bottom: none;
  }
  .post-avatar .avatar {
    width: 3.5rem;
  }
  .post-text {
    line-height: 1.6;
    word-break: break-word;
  }
  .post-meta {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-contrast);
    font-size: 0.9em;
    margin-bottom: 0.5rem;
    line-height: 1;

    .author {
      font-weight: 700;
    }
    .meta-item {
      margin-right: 1rem;
    }
    .factor-avatar {
      width: 1.5rem;
      display: none;
    }
  }
  @media (max-width: 900px) {
    padding: 0 1rem;
    grid-gap: 1rem;
    grid-template-columns: 1fr;
    .post-avatar {
      display: none;
    }
    .post-meta {
      .meta-item {
        font-size: 12px;
      }
      .factor-avatar {
        display: block;
      }
    }

    .post-text {
      font-size: 1rem;
    }
  }
  .post-footer {
    text-align: right;
    position: absolute;
    right: 0;
    bottom: 0;
    .actions {
      transition: opacity 0.2s;
      opacity: 0;
    }

    .post-action {
      user-select: none;
      display: inline-block;
      cursor: pointer;

      padding: 0.2rem 1rem;
      opacity: 0.7;
      font-size: 0.9em;
      &:hover {
        opacity: 1;
        color: var(--color-primary);
      }
      &:active {
        background: rgba(0, 0, 0, 0.08);
      }
    }
    @media (max-width: 900px) {
      .post-action {
        font-size: 12px;
        padding: 0.25em 1rem;
      }
    }
  }
  &:hover .post-footer .actions {
    opacity: 1;
  }
}
</style>
