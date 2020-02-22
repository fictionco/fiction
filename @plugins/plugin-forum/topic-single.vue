<template>
  <div class="topic-single">
    <div class="topic-header">
      <div class="header-main">
        <component :is="setting('forum.components.navBack')" class="forum-home-link" />

        <div class="text">
          <div class="text-header">
            <h1 class="title">{{ excerpt(post.title, {length: 22}) }}</h1>
            <h2 v-if="post.synopsis" class="synopsis">{{ excerpt(post.synopsis, {length: 22}) }}</h2>
            <div v-if="post.pinned || post.locked" class="notes">
              <div v-if="post.locked" class="note locked">
                <factor-icon icon="fas fa-lock" />Locked
              </div>
              <div v-if="post.pinned" class="note locked">
                <factor-icon icon="fas fa-thumbtack" />Pinned
              </div>
            </div>
          </div>
          <div v-if="post.tag && post.tag.length > 0" class="meta">
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
              @action="handleAction(topicPost, ...arguments)"
            />
          </factor-highlight-code>
        </div>
        <component
          :is="setting('forum.components.topicReply')"
          :post-id="post._id"
          :show-subscriber="!subscribed ? true : false"
          @done="handleNewReply($event)"
        />
      </div>
      <div class="topic-sidebar-wrap">
        <factor-loading-ring v-if="loading" />
        <div v-else class="topic-sidebar">
          <div class="number-posts item">
            <factor-icon icon="far fa-comment" />
            <span class="text">{{ (post.embeddedCount || 0) + 1 }}</span>
          </div>
          <factor-btn
            v-if="currentUser"
            class="item"
            btn="primary"
            @click="focusReply()"
          >Add Reply &darr;</factor-btn>
          <factor-link v-else event="sign-in-modal" class="item" btn="primary">Login to Reply &rarr;</factor-link>
          <factor-btn
            v-if="currentUser"
            class="item"
            btn="default"
            :loading="sending"
            @click="subscribe(subscribed ? false : true)"
          >
            <factor-icon icon="far fa-star" />
            <span class="text normal">{{ subscribed ? "Subscribed" : "Subscribe" }}</span>
          </factor-btn>

          <factor-btn v-if="canEditTopic" class="item" btn="default" @click="editTopic(post)">
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
import {
  factorLoadingRing,
  factorAvatar,
  factorBtn,
  factorIcon,
  factorModal,
  factorLink
} from "@factor/ui"
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
import { currentUser, userCan, userInitialized } from "@factor/user"
import { FactorPost } from "@factor/post/types"
import {
  editTopic,
  postAction,
  PostActions,
  requestIsSubscribed,
  requestSetSubscribed
} from "./request"

export default Vue.extend({
  components: {
    factorAvatar,
    factorBtn,
    factorHighlightCode,
    factorIcon,
    factorModal,
    factorLink,
    factorLoadingRing
  },
  data() {
    return {
      vis: false,
      editPost: {},
      highlight: "",
      subscribed: false,
      sending: false,
      loading: true
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
    currentUser,
    canEditTopic(this: any): boolean {
      if (userCan({ accessLevel: 200, post: this.post })) {
        return true
      } else {
        return false
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
  async mounted() {
    onEvent("highlight-post", (_id: string) => {
      this.highlight = _id
      setTimeout(() => {
        this.highlight = ""
      }, 2000)
    })

    await Promise.all([userInitialized(), this.setSubscribed()])

    this.loading = false
  },
  methods: {
    isEmpty,
    setting,
    toLabel,
    editTopic,
    excerpt,
    async setSubscribed(this: any) {
      await userInitialized()
      if (this.currentUser) {
        this.subscribed = await requestIsSubscribed({
          postId: this.post._id,
          userId: this.currentUser._id
        })
      }
    },
    async subscribe(this: any, subscribe = true) {
      this.sending = true
      this.subscribed = await requestSetSubscribed({
        subscribe,
        postId: this.post._id,
        userId: this.currentUser._id
      })

      this.sending = false
    },
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
    async handleAction(
      this: any,
      topicPost: FactorPost,
      action: PostActions,
      value: boolean
    ) {
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
          value: value,
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
    },
    handleNewReply(this: any, emitted: { subscribed?: boolean }) {
      const { subscribed } = emitted
      if (typeof subscribed != "undefined") {
        this.subscribed = subscribed
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

  .forum-home-link {
    margin-bottom: 1.5rem;
  }
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
    .notes {
      display: flex;
      margin-top: 1rem;
      .note {
        border-radius: 7px;
        text-transform: uppercase;
        font-size: 0.85rem;

        padding: 0.25rem 1rem;
        margin-right: 1rem;
        font-weight: 700;
        background: var(--color-bg-contrast);
        .factor-icon {
          opacity: 0.6;
          margin-right: 0.5rem;
          font-size: 0.9em;
        }
      }
    }
  }

  .meta {
    display: flex;
    .meta-item {
      margin-right: 1rem;
    }
    margin-bottom: 1rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    .header-main {
      .meta {
        display: none;
      }
    }
    .header-sub {
      text-align: left;
    }
    .text-header {
      margin-bottom: 0;
    }
  }
}

.content-area {
  display: grid;
  grid-template-columns: 2fr 200px;
  grid-template-areas: "topic-content topic-sidebar";
  grid-gap: 1rem 4rem;
  position: relative;

  .loading-ring-wrap {
    padding: 3em 0;
  }
  .topic-sidebar {
    grid-area: topic-sidebar;
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
      width: 100%;
    }
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-areas: "topic-sidebar" "topic-content";
    .topic-sidebar {
      padding-bottom: 0;
    }
  }
}
.topic-content {
  min-width: 0;
  grid-area: topic-content;
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

    .loading-ring-wrap,
    .reply-area {
      grid-area: reply;
      min-width: 0;
    }
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-template-areas: "reply";
    }
  }
}
</style>
