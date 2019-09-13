<template>
  <dashboard-page :loading="loading">
    <div class="post-grid">
      <div class="content-column">
        <dashboard-pane :title="title" class="compose">
          <dashboard-input
            v-model="post.title"
            input="factor-input-text"
            label="Title"
            class="post-title"
            @keyup="doDraftSave()"
          />
          <dashboard-input
            v-model="post.subTitle"
            input="factor-input-text"
            label="Sub Title / Teaser"
            class="post-title"
            @keyup="doDraftSave()"
          />
          <dashboard-input label="Permalink">
            <input-permalink v-model="post.permalink" :initial="post.title" :post-type="postType" />
          </dashboard-input>
          <dashboard-input label="Post Content">
            <input-editor v-model="post.content" @keyup="doDraftSave()" />
          </dashboard-input>
        </dashboard-pane>
        <!-- <dashboard-pane v-for="(item, i) in injectedMetaComponents" :key="i" :title="item.name">
          <component :is="item.component" v-model="post" />
        </dashboard-pane>-->
        <dashboard-pane title="Meta Info" class="post-media">
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

        <slot name="edit" />
      </div>
      <div class="meta-column">
        <dashboard-pane title="Publication" class="post-actions">
          <dashboard-input
            v-model="post.status"
            :list="['published', 'draft', 'trash']"
            input="factor-input-select"
          />

          <div v-if="!$lodash.isEmpty(lastRevision)" class="save-info">
            <factor-loading-ring v-if="sendingDraft" width="1.4em" />
            <template v-else>
              <div
                v-if="!lastRevision.published"
                class="changes unpublished"
              >There are unpublished changes.</div>
              <div
                class="saved-at"
              >Draft Saved at {{ $time.util(lastRevision.timestamp).format("h:mma (M/D)") }}</div>
            </template>
            <div class="draft-actions">
              <factor-btn size="tiny" class="save-draft" @click="saveDraft()">Save Draft</factor-btn>
              <factor-btn
                v-if="canRevert"
                size="tiny"
                class="revert"
                @click="revertChanges()"
              >Revert to published?</factor-btn>
            </div>
          </div>
          <template slot="actions">
            <factor-btn btn="primary" :loading="sending" @click="savePost()">
              Update
              &nbsp;
              <factor-icon icon="arrow-up" />
            </factor-btn>
            <factor-link v-if="post.permalink" :path="url" btn="default" data-test="add-post">
              View
              <factor-icon icon="arrow-right" />
            </factor-link>
          </template>
        </dashboard-pane>
        <slot name="meta" />
      </div>
      <div class="content-column plugin-column" />
    </div>
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "input-editor": () => import("./el/editor"),
    "input-permalink": () => import("./el/permalink"),
    "input-tags": () => import("./el/tags")
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
  metatags() {
    return {
      title: this.title
    }
  },
  computed: {
    post: {
      get() {
        return this.$store.val(this._id) || {}
      },
      set(v) {
        this.$store.add(this._id, v)
      }
    },

    _id() {
      return this.$route.query._id || ""
    },
    injectedComponents() {
      const components = this.$filters.apply("post-edit-components", [])

      return components.filter(
        ({ postType }) =>
          !postType || (postType && postType.includes(this.postType))
      )
    },

    excerpt() {
      return this.$utils.excerpt(this.post.content)
    },
    title() {
      const mode = this.isNew ? "Add New" : "Edit"

      return `${mode} ${this.$utils.toLabel(this.postType)}`
    },

    postType() {
      return this.$route.params.postType || this.post.postType || "page"
    },
    url() {
      return this.$post.getPermalink({
        postType: this.postType,
        permalink: this.post.permalink,
        root: false
      })
    },

    lastRevision() {
      return this.post.revisions && this.post.revisions.length > 0
        ? this.post.revisions[0]
        : {}
    },
    canRevert() {
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
    async savePost() {
      this.sending = true

      this.clearAutosave()

      this.$events.$emit("lockPermalink")

      const saved = await this.$post.save({
        post: this.post,
        postType: this.postType
      })

      if (saved) {
        this.post = saved
        this.$events.$emit("notify", `Saved!`)
      }

      this.sending = false
    },

    doDraftSave() {
      if (!this.willsave) {
        this.willsave = setTimeout(() => {
          this.saveDraft()
        }, 30000)
      }
    },

    clearAutosave() {
      clearTimeout(this.willsave)
      this.willsave = null
    },

    addRevision({ post, meta }) {
      this.clearAutosave()

      const postData = this.$post.addRevision({ post, meta })

      this.$set(this.post, "revisions", postData.revisions)

      return true
    },

    revertChanges() {
      const { revisions, ...post } = this.post

      let revertTo = {}
      const newRevisions = this.$lodash.cloneDeep(revisions)
      revisions.some((r, index) => {
        if (r.published) {
          revertTo = r.post
          return true
        } else {
          newRevisions.splice(index, 1)
        }
      })

      const newPost = Object.assign(
        {},
        { ...this.post, revisions: newRevisions, ...revertTo }
      )

      this.post = newPost

      this.$set(this.post, "revisions", newRevisions)
    },

    async saveDraft() {
      this.sendingDraft = true

      await this.addRevision({ post: this.post, save: true })

      this.sendingDraft = false
    }
  }
}
</script>
<style lang="less">
.post-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 250px;
  //grid-template-rows: 1fr 1fr 1fr 1fr;
  @media (max-width: 960px) {
    grid-gap: 1em 0;
  }

  .dashboard-pane {
    margin-bottom: 1em;
  }

  // .content-column {
  //   grid-column: span 3;
  // }
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