<template>
  <div class="topic-post">
    <div class="post-avatar">
      <factor-avatar :post-id="author.avatar" />
    </div>
    <div class="post-content">
      <div class="post-meta">
        <div class="author meta-item">{{ author.username }}</div>
        <div class="time meta-item">{{ timeAgo(post.createdAt) }}</div>
        <factor-menu :list="actions" @action="handleAction($event)" />
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
import Vue from "vue"
import { FactorPost } from "@factor/post/types"
import { PostActions } from "./request"
export default Vue.extend({
  components: { factorAvatar, factorMenu },
  props: {
    postId: { type: String, default: "" },
    parentId: { type: String, default: "" }
  },

  data() {
    return {
      running: false
    }
  },

  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      }
    },
    isParent(this: any): boolean {
      return this.postId == this.parentId ? true : false
    },
    actions(this: any): PostActions[] {
      if (this.isParent) {
        return [
          PostActions.Edit,
          this.post.pinned ? PostActions.Unpin : PostActions.Pin,
          this.post.locked ? PostActions.Unlock : PostActions.Lock,
          PostActions.Delete
        ]
      } else {
        return [PostActions.Edit, PostActions.Delete]
      }
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content)
    },
    author(this: any) {
      const authorId =
        this.post.author && this.post.author.length > 0 ? this.post.author[0] : ""
      return this.getPost(authorId) || {}
    }
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
      this.$emit("action", action)
    }
  }
})
</script>
<style lang="less">
.topic-post {
  @import "~@factor/ui/css/standard-entry.less";
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  grid-gap: 2rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--color-border);
  .post-content {
    min-width: 0;
  }
  &:last-child {
    border-bottom: none;
  }
  .post-avatar .avatar {
    width: 3.5rem;
  }
  .post-text {
    font-size: 1.2em;
    line-height: 1.6;
    margin: 2em 0 2em 0;
  }
  .post-meta {
    display: flex;
    margin-bottom: 1rem;
    line-height: 1;
    .author {
      font-weight: 700;
    }
    .meta-item {
      margin-right: 2rem;
    }
  }
  .post-footer {
    text-align: right;

    .actions {
      transition: opacity 0.5s;
      opacity: 0;
    }

    .post-action {
      display: inline-block;
      cursor: pointer;
      margin: 0.5rem 1rem;
      opacity: 0.7;
      font-size: 0.9em;
      &:hover {
        opacity: 1;
        color: var(--color-primary);
      }
    }
  }
  &:hover .post-footer .actions {
    opacity: 1;
  }
}
</style>
