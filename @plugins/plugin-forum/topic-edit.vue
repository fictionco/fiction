<template>
  <div class="topic-new">
    <factor-loading-ring v-if="loading" />
    <template v-else>
      <div class="header-area">
        <component :is="setting('forum.components.navBack')" class="back" />
        <div class="title-area">
          <h1 class="title">{{ isNew ? "New" : "Edit" }} Topic</h1>
          <div class="header-actions">
            <factor-link
              v-if="!isNew"
              btn="default"
              class="item"
              :path="topicLink(post)"
            >View Topic &rarr;</factor-link>

            <factor-btn
              class="item"
              btn="primary"
              :loading="sending"
              @click="submit()"
            >{{ isNew ? "Post Topic" : "Save Changes" }} &rarr;</factor-btn>
          </div>
        </div>
      </div>
      <div class="form-area">
        <factor-form ref="form">
          <div class="primary-inputs">
            <factor-input-wrap
              v-model="post.title"
              input="factor-input-text"
              class="topic-new-textarea"
              label="Title"
              placeholder="Topic"
              required
            />

            <factor-input-wrap
              v-model="post.content"
              input="factor-input-editor"
              label="Content"
              description="Markdown is supported"
              placeholder="Post content"
              required
            />
            <factor-input-wrap
              v-model="post.synopsis"
              input="factor-input-text"
              class="topic-new-textarea"
              label="Synopsis"
              placeholder="Topic Summary"
              required
            />
          </div>

          <div class="meta">
            <factor-input-wrap
              v-model="post.tag"
              class="meta-item"
              label="Tags"
              input="factor-input-tags"
            />
            <factor-input-wrap
              v-model="post.category"
              class="meta-item"
              label="Category"
              input="factor-input-tags"
              placeholder="Category"
              :list="setting(`forum.categories`)"
            />
          </div>
        </factor-form>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api/settings"
import {
  factorForm,
  factorInputWrap,
  factorBtn,
  factorIcon,
  factorLoadingRing,
  factorLink
} from "@factor/ui"
import { stored, storeItem } from "@factor/api"
import { emitEvent } from "@factor/api/events"
import { FactorPost } from "@factor/post/types"
import { requestPostSingle } from "@factor/post/request"
import { saveTopic, redirectToTopic, topicLink } from "./request"
import { postType } from "."
export default Vue.extend({
  components: {
    factorInputWrap,
    factorBtn,
    factorIcon,
    factorForm,
    factorLoadingRing,
    factorLink
  },
  data() {
    return {
      form: {},
      sending: false,
      loading: true
    }
  },
  metaInfo() {
    return this.isNew
      ? {
          title: "New Topic",
          description: "Start a new topic discussion on the forum"
        }
      : {
          title: "Edit Topic",
          description: "Edit a forum topic"
        }
  },
  computed: {
    isNew(this: any): boolean {
      return this.$route.path.includes("new") ? true : false
    },
    post: {
      get(this: any): FactorPost {
        return stored(this._id) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this._id, v)
      }
    },
    _id(this: any): string {
      return this.$route.query._id || ""
    }
  },
  mounted() {
    this.requestPost()
  },

  methods: {
    setting,
    topicLink,
    async submit(this: any) {
      const r = this.$refs["form"].$el.reportValidity()

      if (!r) return

      this.sending = true
      try {
        const createdTopic = await saveTopic(this.post)
        if (createdTopic && createdTopic.permalink) {
          if (this.isNew) {
            emitEvent("notify", "New topic created")
          } else {
            emitEvent("notify", "Topic edited successfully")
          }

          redirectToTopic(createdTopic)
        }
      } catch (error) {
        this.sending = false
      }
      this.sending = false
    },
    async requestPost(this: any) {
      const post = await requestPostSingle({
        _id: this._id,
        postType,
        createOnEmpty: true,
        depth: 100
      })

      /**
       * If a new post is created, it will come with an _id
       * Set the URL Id to the new id if this is the case.
       */
      if (post._id && this._id !== post._id) {
        this.$router.replace({
          query: { ...this.$route.query, _id: post._id }
        })
      }

      this.loading = false
    }
  }
})
</script>
<style lang="less">
.topic-new {
  max-width: 700px;

  margin: 0 auto;
  .header-area {
    grid-area: header;
    .back {
      margin-bottom: 2em;
    }
    .title-area {
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 1.3em;
        letter-spacing: -0.02em;
        font-weight: var(--font-weight-bold, 700);
        margin-bottom: 1rem;
      }
      .factor-btn {
        margin-left: 1rem;
      }
    }
  }
  .form-area {
    grid-area: form;
  }

  .loading-ring-wrap {
    min-height: 40vh;
    padding: 2em 0;
  }
  .primary-inputs {
    font-size: 1.2em;
  }

  .meta {
    display: flex;
    .meta-item {
      margin-right: 2rem;
    }
  }
}
</style>
