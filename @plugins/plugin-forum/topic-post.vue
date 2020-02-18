<template>
  <div class="topic-post">
    <div class="post-avatar">
      <factor-avatar :post-id="author.avatar" />
    </div>
    <div class="post-content">
      <div class="post-meta">
        <div class="author meta-item">{{ author.username }}</div>
        <div class="time meta-item">{{ timeAgo(post.createdAt) }}</div>
        <factor-menu :list="actions" @action="$emit('action', $event)" />
      </div>
      <div class="post-text">
        <factor-highlight-code>
          <div v-formatted-text="rendered" />
        </factor-highlight-code>
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
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import { factorAvatar, factorMenu } from "@factor/ui"
import { isEmpty, setting, stored, toLabel } from "@factor/api"
import { timeAgo } from "@factor/api/time"
import Vue from "vue"
import { postAction, PostActions } from "."
export default Vue.extend({
  components: { factorAvatar, factorHighlightCode, factorMenu },
  props: {
    post: { type: Object, default: () => {} },
    parent: { type: Object, default: () => {} }
  },

  data() {
    return {
      running: false
    }
  },

  computed: {
    actions(this: any): PostActions[] {
      return Object.values(PostActions)
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content)
    },
    author(this: any) {
      return this.getPost(this.post.author[0])
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
      this.running = true

      await postAction({ action, post: this.post, parent: this.parent })

      this.running = false
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
