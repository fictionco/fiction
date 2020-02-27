<template>
  <dashboard-page :loading="loading" :title="title">
    <template #actions>
      <factor-link btn="default" :path="url">View</factor-link>
      <factor-btn-dashboard btn="primary" :loading="sending" @click="savePost()">Update</factor-btn-dashboard>
    </template>
    <template #primary>
      <dashboard-pane class="compose">
        <dashboard-input
          v-model="post.title"
          input="factor-input-text"
          label="Title"
          class="post-title"
          @keyup="doDraftSave()"
        />

        <dashboard-input label="Post Content">
          <factor-input-editor v-model="post.content" :post-id="post._id" />
        </dashboard-input>
      </dashboard-pane>
    </template>
    <template #meta>
      <dashboard-pane class="post-media">
        <dashboard-input
          v-model="post.status"
          label="Status"
          :list="['published', 'draft', 'trash']"
          input="factor-input-select"
        />

        <dashboard-input v-if="postTypeConfig.customPermalink" label="Permalink">
          <input-permalink v-model="post.permalink" :initial="post.title" :post-type="postType" />
        </dashboard-input>
        <dashboard-input
          v-model="post.synopsis"
          input="factor-input-text"
          label="Synopsis"
          description="A short description or teaser"
          class="post-title"
          @keyup="doDraftSave()"
        />
        <factor-client-only>
          <dashboard-input v-model="post.date" input="factor-input-date" label="Date" />
        </factor-client-only>
        <dashboard-input label="Tags">
          <factor-input-tags v-model="post.tag" />
        </dashboard-input>
        <dashboard-input
          v-if="postTypeConfig.categories && postTypeConfig.categories.length > 0"
          label="Category"
        >
          <factor-input-tags v-model="post.category" :list="postTypeConfig.categories" />
        </dashboard-input>
        <dashboard-input
          v-model="post.avatar"
          input="factor-input-image-upload"
          label="Avatar"
          max="1"
          @autosave="saveDraft()"
        />
        <dashboard-input
          v-model="post.images"
          selector="post-images"
          input="factor-input-image-upload"
          label="Post Images"
          @autosave="saveDraft()"
        />
        <dashboard-input v-model="post.author" input="dashboard-user-list" label="Author" />
        <dashboard-input
          v-model="post.source"
          input="factor-input-text"
          label="Source"
          description="Used when sharing DB in multiple apps"
        />
      </dashboard-pane>
      <slot name="meta" />
    </template>
    <template #secondary>
      <slot name="edit" />
    </template>
  </dashboard-page>
</template>
<script lang="ts">
import {
  factorBtnDashboard,
  factorLink,
  factorInputTags,
  factorInputEditor
} from "@factor/ui"
import {
  isEmpty,
  toLabel,
  emitEvent,
  stored,
  timeUtil,
  storeItem,
  getPostTypeConfig,
  PostTypeConfig
} from "@factor/api"
import { excerpt } from "@factor/api/excerpt"
import { requestPostSave } from "@factor/post/request"
import { dashboardPage, dashboardPane, dashboardInput } from "@factor/dashboard"
import Vue from "vue"
import { FactorPost } from "@factor/post/types"
export default Vue.extend({
  components: {
    dashboardInput,
    dashboardPage,
    dashboardPane,
    factorBtnDashboard,
    factorLink,
    factorInputTags,
    factorInputEditor,
    factorClientOnly: () => import("vue-client-only"),
    inputPermalink: () => import("../el/permalink.vue")
  },

  data() {
    return {
      sending: false,
      sendingDraft: false,
      loading: false,
      isNew: null,
      saveNeeded: false,
      willsave: null,
      settings: [],
      reactivePost: {}
    }
  },
  metaInfo() {
    return {
      title: this.title
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this._id) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this._id, v)
      }
    },

    test(this: any) {
      return this.post.title
    },

    _id(this: any): string {
      return this.$route.query._id || ""
    },

    excerpt(this: any) {
      return excerpt(this.post.content)
    },
    postTypeConfig(this: any): PostTypeConfig | {} {
      return getPostTypeConfig(this.postType) || {}
    },
    title(this: any) {
      const mode = this.isNew ? "Add New" : "Edit"
      const name = this.postTypeConfig.nameSingle || toLabel(this.postType)
      return `${mode} ${name}`
    },

    postType(this: any) {
      return this.$route.params.postType || this.post.postType || "page"
    },
    url(this: any) {
      return this.postTypeConfig.permalink(this.post)
    },

    lastRevision(this: any) {
      return this.post.revisions && this.post.revisions.length > 0
        ? this.post.revisions[0]
        : {}
    },
    canRevert(this: any) {
      if (
        !this.lastRevision.published &&
        this.post.revisions &&
        this.post.revisions.length > 0 &&
        this.post.revisions.some(_ => _.published)
      ) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    isEmpty,
    timeUtil,
    async savePost(this: any) {
      this.sending = true

      this.clearAutosave()

      emitEvent("save-post")

      let saved
      try {
        saved = await requestPostSave({
          post: this.post,
          postType: this.postType
        })
      } catch (error) {
        this.sending = false
      }

      if (saved) {
        this.post = saved
        emitEvent("notify", `Saved!`)
      }

      this.sending = false
    },

    doDraftSave(this: any) {
      if (!this.willsave) {
        this.willsave = setTimeout(() => {
          this.saveDraft()
        }, 30000)
      }
    },

    clearAutosave(this: any) {
      clearTimeout(this.willsave)
      this.willsave = null
    },

    async saveDraft(this: any) {
      this.sendingDraft = true

      this.sendingDraft = false
    }
  }
})
</script>
<style lang="less">
.post-grid {
  display: grid;

  @media (max-width: 960px) {
    grid-gap: 1em 0;
  }

  .content-column,
  .meta-column {
    min-width: 0;
    @media (max-width: 960px) {
      grid-column: span 3;
    }
  }
  .meta-column {
    .post-actions {
      top: 20px;
      position: sticky;
      @media (max-width: 767px) {
        .foot {
          position: fixed;
          bottom: 0;
          top: auto;
          width: 100%;
          left: 0;
        }
      }
    }
  }

  .save-info {
    line-height: 1.5;
    font-size: 12px;
    opacity: 0.4;
    .draft-actions {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      .el-tag {
        margin-right: 8px;
      }
    }

    .unpublished {
      font-weight: var(--font-weight-bold);
    }
    .revert {
      cursor: pointer;
    }
  }
  .post-title input[type="text"] {
    width: 100%;
    font-size: 1.2em;
  }

  .post-actions .foot .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .trash {
      font-size: 0.9em;
      font-weight: 500;
    }
  }
}
</style>
