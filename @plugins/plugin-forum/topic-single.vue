<template>
  <div class="single-entry">
    <div class="topic-header">
      <div class="header-main">
        <component :is="setting('forum.components.navBack')" />

        <div class="text">
          <div class="text-header">
            <h1 class="title">{{ excerpt(post.title, {length: 22}) }}</h1>
            <h1 v-if="post.synopsis" class="synopsis">{{ excerpt(post.synopsis, {length: 22}) }}</h1>
          </div>
          <div class="meta">
            <component
              :is="setting('forum.components.topicTags')"
              class="meta-item"
              :tags="post.tag"
            />
          </div>
        </div>
      </div>
      <div class="header-sub">
        <div v-for="(cat, i) in post.category" :key="i" class="category">{{ toLabel(cat) }}</div>
      </div>
    </div>

    <div class="content-area">
      <div class="topic-content">
        <div class="topic-posts">
          <component
            :is="setting('forum.components.topicPost')"
            v-for="(topicPost, index) in topicPosts"
            :key="index"
            :post="topicPost"
            @action="handleAction($event)"
          />
        </div>

        <component :is="setting('forum.components.topicReply')" :post-id="post._id" />
      </div>
      <div class="topic-sidebar-wrap">
        <div class="topic-sidebar">
          <div class="number-posts item">
            <factor-icon icon="far fa-comment" />
            <span class="text">{{ (post.embeddedCount || 0) + 1 }}</span>
          </div>
          <factor-btn class="item" btn="primary" @click="focusReply()">Add Reply &darr;</factor-btn>

          <factor-btn class="item" btn="default">
            <factor-icon icon="far fa-star" />
            <span class="text">Subscribe</span>
          </factor-btn>

          <factor-btn class="item" btn="default" @click="editTopic(post)">
            <span class="text">Edit</span>
          </factor-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { excerpt } from "@factor/api/excerpt"
import { renderMarkdown } from "@factor/api/markdown"
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import { factorAvatar, factorBtn, factorIcon } from "@factor/ui"
import {
  isEmpty,
  setting,
  stored,
  titleTag,
  descriptionTag,
  shareImage,
  toLabel,
  emitEvent
} from "@factor/api"
import Vue from "vue"
import { editTopic, deleteTopic } from "./request"
export default Vue.extend({
  components: { factorAvatar, factorBtn, factorHighlightCode, factorIcon },
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id)
    }
  },
  computed: {
    post() {
      return stored("post") || {}
    },
    topicPosts(this: any) {
      return [this.post, ...this.post.embedded]
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content)
    }
  },

  methods: {
    isEmpty,
    setting,
    toLabel,
    editTopic,
    excerpt,
    focusReply() {
      emitEvent("focus-editor")
      const el: HTMLFormElement | null = document.querySelector("#topic-reply")
      if (el) {
        el.focus()
      }
    },
    getPost(_id: any) {
      return stored(_id) || {}
    },
    async handleAction(this: any, action: string) {
      if (action == "edit") {
        editTopic(this.post)
      } else if (action == "delete") {
        deleteTopic(this.post)
      }
    }
  }
})
</script>
<style lang="less">
.topic-header {
  display: grid;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
  grid-template-columns: 1fr 300px;
  align-items: center;
  .header-sub {
    text-align: right;
    .category {
      display: inline-block;
      padding: 0.5em 1em;
      font-weight: 700;
      border-radius: 7px;
      background: var(--color-bg-contrast);
      margin: 0.5rem;
    }
  }
  .text {
    padding: 2em 0;
  }
  .text-header {
    margin-bottom: 1rem;
    .title {
      font-size: 2.4em;
      letter-spacing: -0.025em;
      line-height: 1.1;

      font-weight: var(--font-weight-bold, 700);
    }
    .synopsis {
      font-size: 1.4em;
      opacity: 0.7;
    }
  }

  .meta {
    display: flex;

    .meta-item {
      margin-right: 1rem;
    }
  }
}

.content-area {
  display: grid;
  grid-template-columns: 2fr 200px;
  grid-gap: 4rem;
  position: relative;
  .topic-sidebar {
    position: sticky;
    top: 200px;
    padding-bottom: 600px;
    .number-posts {
      font-size: 1.5em;
      text-align: center;
      font-weight: 800;
    }
    .factor-btn {
      display: block;
      width: 100%;
      .text {
        margin: 0 0.25rem;
      }
    }
    .item {
      margin-bottom: 1rem;
    }
  }
}
.topic-content {
  padding: 1rem 0 1rem 2rem;
}
</style>
