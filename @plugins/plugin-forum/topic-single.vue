<template>
  <div class="topic-single">
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
          <factor-highlight-code>
            <component
              :is="setting('forum.components.topicPost')"
              v-for="(topicPost, index) in topicPosts"
              :key="index"
              class="tpost"
              :class="highlight == topicPost._id ? 'highlight' : '' "
              :post-id="topicPost._id"
              :parent-id="post._id"
              @action="handleAction($event, topicPost)"
            />
          </factor-highlight-code>
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
    <factor-modal :vis.sync="vis" class="edit-reply-modal">
      <div class="form-info">
        <h2>Edit Reply</h2>
        <component
          :is="setting('forum.components.topicReply')"
          :post-id="post._id"
          :edit-id="editPost._id"
          @done="vis = false; editPost = {}"
        />
      </div>
    </factor-modal>
  </div>
</template>
<script lang="ts">
import { excerpt } from "@factor/api/excerpt"
import { renderMarkdown } from "@factor/api/markdown"
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import { factorAvatar, factorBtn, factorIcon, factorModal } from "@factor/ui"
import {
  isEmpty,
  setting,
  stored,
  storeItem,
  titleTag,
  descriptionTag,
  shareImage,
  toLabel,
  emitEvent,
  onEvent
} from "@factor/api"
import Vue from "vue"
import { FactorPost } from "@factor/post/types"
import { editTopic, postAction, PostActions } from "./request"

export default Vue.extend({
  components: { factorAvatar, factorBtn, factorHighlightCode, factorIcon, factorModal },
  data() {
    return {
      vis: false,
      editPost: {},
      highlight: ""
    }
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id)
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored("post") || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem("post", v)
      }
    },
    embedded(this: any) {
      return this.post.embedded ?? []
    },
    topicPosts(this: any) {
      return [this.post, ...this.embedded]
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content)
    }
  },
  mounted() {
    onEvent("highlight-post", (_id: string) => {
      this.highlight = _id
      setTimeout(() => {
        this.highlight = ""
      }, 2000)
    })
  },
  methods: {
    isEmpty,
    setting,
    toLabel,
    editTopic,
    excerpt,
    isParent(this: any, topicPost: FactorPost): boolean {
      return topicPost._id == this.post._id ? true : false
    },
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
    async handleAction(this: any, action: PostActions, topicPost: FactorPost) {
      if (action == PostActions.Edit) {
        if (this.isParent(topicPost)) {
          editTopic(this.post)
        } else {
          this.editPost = topicPost
          this.vis = true
        }
      } else {
        await postAction({
          action,
          value: true,
          post: topicPost,
          parentId: this.post._id
        })

        this.handleActionUi(action, topicPost)
      }
    },
    handleActionUi(this: any, action: PostActions, topicPost: FactorPost) {
      if (this.post._id != topicPost._id)
        if (action == PostActions.Delete) {
          const ind = this.embedded.findIndex((_: FactorPost) => _._id == topicPost._id)

          if (this.post.embedded && this.post.embedded.length > 0) {
            this.post.embedded.splice(ind, 1)
          }

          this.post.embeddedCount = this.post.embeddedCount - 1
        }
    }
  }
})
</script>
<style lang="less">
.edit-reply-modal {
  h2 {
    font-size: 1.3em;
    margin-bottom: 1rem;
  }
}
.topic-header {
  display: grid;
  border-bottom: 1px solid var(--color-border);

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
    margin-top: 2rem;
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
  min-width: 0;
  .tpost {
    transition: all 0.3s;
    background: transparent;
    &.highlight {
      background: var(--color-bg-contrast);
    }
  }
  .topic-posts {
    padding-bottom: 2rem;
  }
  .topic-reply {
    display: grid;
    grid-template-columns: 5rem 1fr;
    grid-template-areas: ". reply";
    .reply-area {
      grid-area: reply;
    }
  }
}
</style>
