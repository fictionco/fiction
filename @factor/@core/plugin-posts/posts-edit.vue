<template>
  <dashboard-page :loading="loading">
    <div class="post-grid">
      <div class="content-column">
        <dashboard-pane :title="title" class="compose">
          <template slot="nav">
            <!-- <factor-link v-if="post.permalink" :path="url" btn="secondary" data-test="add-post">
              View {{ $utils.toLabel(postType) }}
              <i class="fa fa-arrow-right" />
            </factor-link>-->
          </template>
          <factor-input-wrap
            v-model="post.title"
            input="factor-input-text"
            label="Title"
            class="post-title"
            @keyup="doAutosave()"
          />
          <factor-input-wrap label="Permalink">
            <input-permalink v-model="post.permalink" :initial="post.title" :type="postType" />
          </factor-input-wrap>
          <factor-input-wrap label="Post Content">
            <input-editor v-model="post.content" @keyup="doAutosave()" />
          </factor-input-wrap>
        </dashboard-pane>
        <!-- <dashboard-pane v-for="(item, i) in injectedMetaComponents" :key="i" :title="item.name">
          <component :is="item.component" v-model="post" />
        </dashboard-pane>-->
        <dashboard-pane title="Meta Info" class="post-media">
          <factor-input-wrap
            v-model="post.date"
            format="horizontal"
            input="factor-input-date"
            label="Publish Date"
          />
          <factor-input-wrap format="horizontal" label="Tags">
            <input-tags v-model="post.tags" />
          </factor-input-wrap>

          <factor-input-wrap
            v-model="post.images"
            input="factor-input-image-upload"
            label="Post Images"
            format="horizontal"
            @autosave="saveDraft()"
          />
          <factor-input-wrap
            v-model="post.authors"
            format="horizontal"
            input="factor-input-user-list"
            label="Author"
          />
        </dashboard-pane>

        <dashboard-pane v-for="(item, i) in injectedComponents" :key="i" :title="item.name">
          <component :is="item.component" v-model="post" />
        </dashboard-pane>
      </div>
      <div class="meta-column">
        <dashboard-pane title="Publication" class="post-actions">
          <factor-input-wrap
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
              <i class="fa fa-arrow-up" />
            </factor-btn>
            <factor-link v-if="post.permalink" :path="url" btn="default" data-test="add-post">
              View
              <i class="fa fa-arrow-right" />
            </factor-link>
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
      loading: true,
      post: {
        revisions: []
      },
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
    injectedComponents() {
      return this.$filters.apply("post-edit-components", [])
    },
    injectedMetaComponents() {
      return this.$filters.apply("post-edit-meta", [])
    },
    excerpt() {
      return this.$posts.excerpt(this.post.content)
    },
    title() {
      const mode = this.isNew ? "Add New" : "Edit"

      return `${mode} ${this.$utils.toLabel(this.postType)}`
    },

    postType() {
      return this.$route.params.type || this.post.type || "page"
    },
    url() {
      return this.$posts.getPermalink({
        type: this.postType,
        permalink: this.post.permalink
      })
    },
    id() {
      return this.$route.query.id || this.$guid()
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
    // "post.template": {
    //   handler: function(v) {
    //     this.setSettings()
    //   },
    //   immediate: true
    // },

    $route: function(to, from) {
      this.loading = true
      this.$user.init(async () => {
        await this.start()

        this.loading = false
      })
    }
  },
  mounted() {
    this.$user.init(async () => {
      if (this.$uid) {
        await this.start()
      }

      this.loading = false
    })
  },
  methods: {
    // async setSettings() {
    //   if (this.post.template) {
    //     const tpls = this.$posts.getPageTemplates()

    //     const { default: tpl } = await tpls
    //       .find(_ => _.value == this.post.template)
    //       .component()
    //     // const tpl = c.default;
    //     // console.log("ccc", tpl)
    //     if (tpl.pageTemplate) {
    //       this.settings = tpl.pageTemplate()
    //     } else if (tpl.default.methods.pageTemplate) {
    //       this.settings = c.default.methods.pageTemplate()
    //     }
    //   }
    // },
    async start() {
      const id = this.id

      if (!this.$route.query.id) {
        this.$router.replace({
          query: { ...this.$route.query, id }
        })
      }

      const starting = {
        id,
        type: this.postType,
        authors: [this.$uid],
        status: "draft",
        date: this.$time.stamp(),
        content: ""
      }

      const existing = await this.$posts.getPostById(id)
      const lastRev =
        existing && existing.revisions && existing.revisions.length > 0
          ? existing.revisions[0].post
          : {}

      this.isNew = !existing || !existing.id ? true : false

      this.post = Object.assign({}, starting, existing, lastRev)
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

    addRevision(meta = {}) {
      this.clearAutosave()

      let { revisions, ...post } = this.post

      revisions = revisions || []

      const draft = {
        timestamp: this.$time.stamp(),
        editor: this.$uid,
        post,
        ...meta
      }

      this.$set(this.post, "revisions", [draft, ...revisions])

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
      const needed = this.addRevision()

      if (!needed) {
        return
      }

      const save = {
        id: this.id,
        revisions: this.post.revisions
      }

      this.sendingDraft = true

      await this.$posts.saveDraft(save)

      this.sendingDraft = false
    },

    async savePost() {
      this.sending = true

      this.clearAutosave()

      this.$events.$emit("lockPermalink")

      this.addRevision({ published: true })

      this.post.status = this.post.status ? this.post.status : "draft"

      const save = { ...this.post, url: this.url }

      await this.$posts.savePost(save)

      this.$events.$emit("notify", "Post Saved")

      this.sending = false
    },
    async trashPost() {
      this.sending = true

      await this.$posts.savePost(this.post)

      this.sending = false
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
      font-weight: 600;
    }
    .revert {
      cursor: pointer;
    }
  }
  .post-title .text-input input {
    width: 100%;
  }
  // .post-actions {
  //   grid-row: span 2;
  // }
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