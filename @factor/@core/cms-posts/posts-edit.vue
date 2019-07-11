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
            @keyup="doAutosave()"
          />
          <dashboard-input label="Permalink">
            <input-permalink v-model="post.permalink" :initial="post.title" :type="post.type" />
          </dashboard-input>
          <dashboard-input label="Post Content">
            <input-editor v-model="post.content" @keyup="doAutosave()" />
          </dashboard-input>
        </dashboard-pane>
        <!-- <dashboard-pane v-for="(item, i) in injectedMetaComponents" :key="i" :title="item.name">
          <component :is="item.component" v-model="post" />
        </dashboard-pane>-->
        <dashboard-pane title="Meta Info" class="post-media">
          <dashboard-input v-model="post.date" input="factor-input-date" label="Publish Date" />
          <dashboard-input label="Tags">
            <input-tags v-model="post.tags" />
          </dashboard-input>

          <dashboard-input
            v-model="post.images"
            input="factor-input-image-upload"
            label="Post Images"
            @autosave="saveDraft()"
          />
          <dashboard-input v-model="post.authors" input="dashboard-user-list" label="Author" />
        </dashboard-pane>

        <dashboard-pane v-for="(item, i) in injectedComponents" :key="i" :title="item.name">
          <component :is="item.component" v-model="post" />
        </dashboard-pane>
      </div>
      <div class="meta-column">
        <dashboard-pane title="Publication" class="post-actions">
          <dashboard-input
            v-model="post.status"
            :list="[{name: 'Published', value: 'published'}, {name: 'Draft', value: 'draft'}, {name: 'Move to Trash', value: 'trash'}]"
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
              <dashboard-btn size="tiny" class="save-draft" @click="saveDraft()">Save Draft</dashboard-btn>
              <dashboard-btn
                v-if="canRevert"
                size="tiny"
                class="revert"
                @click="revertChanges()"
              >Revert to published?</dashboard-btn>
            </div>
          </div>
          <template slot="actions">
            <dashboard-btn btn="primary" :loading="sending" @click="savePost()">
              Update
              &nbsp;
              <factor-icon icon="arrow-up" />
            </dashboard-btn>
            <dashboard-link v-if="post.permalink" :path="url" btn="default" data-test="add-post">
              View
              <factor-icon icon="arrow-right" />
            </dashboard-link>
          </template>
        </dashboard-pane>
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
    post() {
      return this.$store.getters["getItem"](this._id) || {}
    },
    _id() {
      return this.$route.query._id || ""
    },
    injectedComponents() {
      const components = this.$filters.apply("post-edit-components", [])

      return components.filter(
        _ => !_.type || (_.type && _.type.includes(this.postType))
      )
    },

    excerpt() {
      return this.$posts.excerpt(this.post.content)
    },
    title() {
      const mode = this.isNew ? "Add New" : "Edit"

      return `${mode} ${this.$utils.toLabel(this.postType)}`
    },

    postType() {
      return this.$route.params.postType || this.post.type || "page"
    },
    url() {
      return this.$posts.getPermalink({
        type: this.postType,
        permalink: this.post.permalink
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
  watch: {
    $route: function(to, from) {}
  },
  mounted() {},
  methods: {
    async savePost() {
      this.sending = true

      this.clearAutosave()

      this.$events.$emit("lockPermalink")

      const saved = await this.$posts.save({
        post: this.post,
        postType: this.postType
      })

      if (saved) {
        this.$events.$emit("notify", `Saved!`)
      }

      this.sending = false
    },

    doAutosave() {
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

      const postData = this.$posts.addRevision({ post, meta })

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
    }

    @media (max-width: 960px) {
      display: grid; // Added to order items
      .post-media {
        order: 1;
      }
      .post-actions {
        order: 2;
      }
      .post-tags {
        order: 3;
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