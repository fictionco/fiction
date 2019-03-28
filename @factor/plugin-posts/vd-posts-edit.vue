<template>
  <dashboard-page :loading="loading">
    <div class="post-grid">
      <div class="content-column">
        <dashboard-pane :title="title" class="compose">
          <template slot="nav">
            <el-link v-if="post.permalink" :path="url" btn="secondary" data-test="add-post">
              View Post
              <i class="fa fa-arrow-right" />
            </el-link>
          </template>
          <form-input
            v-model="post.title"
            input="text"
            label="Title"
            class="post-title"
            @keyup="doAutosave()"
          />
          <form-input
            v-model="post.permalink"
            :initial="post.title"
            :type="postType"
            input="permalink"
            label="Permalink"
          />
          <form-input
            v-model="post.content"
            input="editor"
            label="Post Content"
            @keyup="doAutosave()"
          />
        </dashboard-pane>
      </div>
      <div class="meta-column">
        <dashboard-pane title="Publication" class="post-actions">
          <form-input-lat v-model="post.date" input="date" label="Date" />
          <form-input-lat
            v-model="post.status"
            :input-list="[{name: 'Published', value: 'published'}, {name: 'Draft', value: 'draft'}, {name: 'Move to Trash', value: 'trash'}]"
            input="select"
            label="Status"
          />
          <form-input-lat
            v-model="post.type"
            :input-list="$posts.getPostTypes()"
            input="select"
            label="Type"
          />
          <form-input-lat
            v-if="post.type == 'page'"
            v-model="post.template"
            :input-list="$posts.getPageTemplates()"
            input="select"
            label="Template"
          />
          <form-input-lat v-model="post.authors" input="user-list" label="Author" />

          <div v-if="!$lodash.isEmpty(lastRevision)" class="save-info">
            <loading-ring v-if="sendingDraft" width="1em" />
            <div v-else>Draft Saved at {{ $time.timeFormat(lastRevision.timestamp) }}</div>
            <div v-if="!lastRevision.published" class="changes">
              <span class="unpublished">There are unpublished changes.</span>
              <span v-if="canRevert" class="revert" @click="revertChanges()">Revert?</span>
            </div>
          </div>
          <template slot="actions">
            <el-btn btn="primary" :loading="sending" @click="publishPost()">
              Update Post
              &nbsp;
              <i class="fa fa-arrow-up" />
            </el-btn>
          </template>
        </dashboard-pane>
        <dashboard-pane title="Media">
          <form-input
            v-model="post.images"
            input="image"
            label="Post Images"
            :input-destination="`/posts/${post.id}/__name.__ext`"
          />
          <form-input
            v-model="post.featuredImage"
            input="image"
            label="Share Image"
            input-max="1"
            :input-destination="`/posts/${post.id}/__name.__ext`"
          />
        </dashboard-pane>
        <dashboard-pane title="Tags">
          <input-tags v-model="post.tags" />
        </dashboard-pane>

        <dashboard-pane title="SEO">
          <form-input v-model="post.titleTag" input="text" label="Title Tag" />
          <form-input
            v-model="post.description"
            input="textarea"
            label="Post Description / Excerpt"
          />
        </dashboard-pane>
      </div>
    </div>
  </dashboard-page>
</template>
<script>
export default {
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
      willsave: null
    }
  },
  metatags() {
    return {
      title: this.title
    }
  },
  computed: {
    title() {
      const mode = this.isNew ? "Add New" : "Edit"

      return `${mode} Post`
    },

    postType() {
      return this.$route.query.type || this.post.type || "page"
    },
    url() {
      return this.$posts.getPermalink({
        type: this.postType,
        permalink: this.post.permalink
      })
    },
    id() {
      return this.$route.query.id || this.$uuid()
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
        existing.revisions && existing.revisions.length > 0
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

      console.log("this.post.revisions", this.post.revisions)
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

    async publishPost() {
      this.sending = true

      this.clearAutosave()

      this.$hook.$emit("lockPermalink")

      this.addRevision({ published: true })

      const save = { ...this.post, url: this.url }

      await this.$posts.publishPost(save)

      this.$notify.notify("Post Saved")

      this.sending = false
    },
    async trashPost() {
      this.sending = true

      await this.$posts.publishPost(this.post)

      this.sending = false
    }
  }
}
</script>
<style lang="less">
.post-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  //grid-template-rows: 1fr 1fr 1fr 1fr;
  .dashboard-pane {
    margin-bottom: 1em;
  }
  .content-column,
  .meta-column {
    min-width: 0;
  }
  .content-column {
    grid-column: span 2;
    //grid-row: span 4;
  }
  .save-info {
    line-height: 1.5;
    font-size: 12px;
    opacity: 0.5;
    .changes {
      display: flex;
      justify-content: space-between;
    }
    .unpublished {
      color: #0496ff;
    }
    .revert {
      opacity: 0.5;
      cursor: pointer;
    }
  }
  .post-title .text-input input {
    width: 100%;
  }
  .post-actions {
    grid-row: span 2;
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