<template>
  <dashboard-page :loading="loading" :title="title">
    <template #actions>
      <factor-link btn="default" :path="url">View</factor-link>
      <factor-btn-dashboard btn="primary" :loading="sending" @click="savePost()">Save</factor-btn-dashboard>
    </template>
    <template #primary>
      <dashboard-pane class="compose" title="Content">
        <dashboard-input
          v-model="post.title"
          input="factor-input-text"
          label="Title"
          class="post-title"
          @keyup="doDraftSave()"
        />

        <dashboard-input label="Post Content">
          <input-editor v-model="post.content" @keyup="doDraftSave()" />
        </dashboard-input>
      </dashboard-pane>
    </template>
    <template #meta>
      <dashboard-pane title="Meta Info" class="post-media">
        <dashboard-input label="Permalink">
          <input-permalink v-model="post.permalink" :initial="post.title" :post-type="postType" />
        </dashboard-input>
        <dashboard-input
          v-model="post.subTitle"
          input="factor-input-text"
          label="Sub Title"
          class="post-title"
          @keyup="doDraftSave()"
        />
        <factor-client-only>
          <dashboard-input v-model="post.date" input="factor-input-date" label="Publish Date" />
        </factor-client-only>
        <dashboard-input label="Tags">
          <input-tags v-model="post.tag" />
        </dashboard-input>

        <dashboard-input
          v-model="post.images"
          input="factor-input-image-upload"
          label="Post Images"
          @autosave="saveDraft()"
        />
        <dashboard-input v-model="post.author" input="dashboard-user-list" label="Author" />
      </dashboard-pane>
      <slot name="meta" />
    </template>
    <template #secondary>
      <slot name="edit" />
    </template>
  </dashboard-page>
</template>
<script lang="ts">
import { factorBtnDashboard, factorLink } from "@factor/ui"
import {
  isEmpty,
  cloneDeep,
  toLabel,
  emitEvent,
  stored,
  timeUtil,
  storeItem,
  getPermalink,
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
    factorClientOnly: () => import("vue-client-only"),
    inputEditor: () => import("../el/editor.vue"),
    inputPermalink: () => import("../el/permalink.vue"),
    inputTags: () => import("../el/tags.vue")
  },

  data() {
    return {
      sending: false,
      sendingDraft: false,
      loading: false,
      isNew: null,
      saveNeeded: false,
      willsave: null,
      settings: []
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
      return getPermalink({
        postType: this.postType,
        permalink: this.post.permalink,
        root: false
      })
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

      emitEvent("lockPermalink")

      const saved = await requestPostSave({
        post: this.post,
        postType: this.postType
      })

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

    addRevision(this: any, { post, meta }) {
      this.clearAutosave()

      const postData = this.addRevision({ post, meta })

      this.$set(this.post, "revisions", postData.revisions)

      return true
    },

    revertChanges(this: any) {
      // eslint-disable-next-line no-unused-vars
      const { revisions } = this.post

      let revertTo = {}
      const newRevisions = cloneDeep(revisions)
      revisions.some((r, index: number) => {
        if (r.published) {
          revertTo = r.post
          return true
        } else {
          newRevisions.splice(index, 1)
          return false
        }
      })

      const newPost = Object.assign(
        {},
        { ...this.post, revisions: newRevisions, ...revertTo }
      )

      this.post = newPost

      this.$set(this.post, "revisions", newRevisions)
    },

    async saveDraft(this: any) {
      this.sendingDraft = true

      await this.addRevision({ post: this.post, save: true })

      this.sendingDraft = false
    }
  }
})
</script>
<style lang="less">
.post-grid {
  display: grid;
  // grid-gap: 1em;
  // grid-template-columns: 1fr 250px;
  //grid-template-rows: 1fr 1fr 1fr 1fr;
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
    // .post-actions-wrap {
    //   height: 100vh;
    //   position: relative;
    // }
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

    // @media (max-width: 960px) {
    //   display: grid; // Added to order items
    //   .post-media {
    //     order: 1;
    //   }
    //   .post-actions {
    //     order: 2;
    //   }
    //   .post-tags {
    //     order: 3;
    //   }
    // }
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
    // .changes {
    // }
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
