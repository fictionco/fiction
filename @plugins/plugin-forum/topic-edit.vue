<template>
  <div class="topic-new">
    <factor-spinner v-if="loading" />
    <template v-else>
      <div class="header-area">
        <component :is="setting('forum.components.navBack')" class="back" />
        <div class="title-area">
          <h1
            class="title"
          >{{ setting(`forum.text.${isNew ? "newTopicHeader" : "editTopicHeader"}`) }}</h1>
          <div class="header-actions">
            <factor-link v-if="!isNew" btn="default" class="item" :path="topicLink(post)">
              <span v-formatted-text="setting('forum.text.viewTopic')" />
            </factor-link>
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
              v-if="setting('forum.features.tagging')"
              v-model="post.tag"
              class="meta-item"
              label="Tags"
              input="factor-input-tags"
              description="Choose 1 to 5"
              min="1"
              max="5"
            />
            <factor-input-wrap
              v-model="post.category"
              class="meta-item"
              label="Category"
              description="Choose 1"
              input="factor-input-tags"
              placeholder="Category"
              max="1"
              min="1"
              :list="setting(`forum.categories`)"
            />
          </div>
          <div class="actions">
            <factor-btn class="item" btn="primary" :loading="sending" @click="submit()">
              <span
                v-formatted-text="
                  setting(`forum.text.${isNew ? 'postTopicButton' : 'editTopicButton'}`)
                "
              />
            </factor-btn>
          </div>
        </factor-form>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api/settings"
import {
  factorForm,
  factorInputWrap,
  factorBtn,
  factorIcon,
  factorSpinner,
  factorLink,
} from "@factor/ui"
import { stored, storeItem } from "@factor/api"
import { emitEvent } from "@factor/api/events"
import { FactorPost } from "@factor/post/types"
import { requestPostSingle } from "@factor/post/request"
import { requestSaveTopic, redirectToTopic, topicLink } from "./request"
import { postType } from "."
export default {
  components: {
    factorInputWrap,
    factorBtn,
    factorIcon,
    factorForm,
    factorSpinner,
    factorLink,
  },
  data() {
    return {
      form: {},
      sending: false,
      loading: true,
    }
  },
  metaInfo() {
    return this.isNew
      ? setting("forum.metatags.newTopic")
      : setting("forum.metatags.editTopic")
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
      },
    },
    _id(this: any): string {
      return this.$route.query._id || ""
    },
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
        const createdTopic = await requestSaveTopic(this.post, true)

        if (createdTopic && createdTopic.permalink) {
          if (this.isNew) {
            emitEvent("notify", setting("forum.text.notifyNewTopic"))
          } else {
            emitEvent("notify", setting("forum.text.notifyTopicEdited"))
          }

          redirectToTopic(createdTopic)
        }
      } catch (error) {
        this.sending = false
      }
      this.sending = false
    },
    async requestPost(this: any) {
      /**
       * Create a blank scaffold post
       */
      const post = await requestPostSingle({
        _id: this._id,
        postType,
        createOnEmpty: true,
        depth: 100,
      })

      /**
       * If a new post is created, it will come with an _id
       * Set the URL Id to the new id if this is the case.
       */
      if (post._id && this._id !== post._id) {
        this.$router.replace({
          query: { ...this.$route.query, _id: post._id },
        })
      }

      this.loading = false
    },
  },
}
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
    .actions {
      text-align: right;
      @media (max-width: 900px) {
        margin-top: 1rem;
        text-align: center;
        .factor-btn {
          font-size: 1.2em;
          width: 100%;
          max-width: 400px;
        }
      }
    }
  }

  .spinner-wrap {
    min-height: 40vh;
    padding: 2em 0;
  }
  .primary-inputs {
    font-size: 1.2em;
  }

  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .meta-item {
      margin-right: 2rem;
    }
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
