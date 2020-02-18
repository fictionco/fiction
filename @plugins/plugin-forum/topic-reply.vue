<template>
  <div class="topic-reply">
    <div class="reply-area">
      <factor-avatar :post-id="author.avatar" />
      <factor-input-editor
        id="topic-reply"
        v-model="reply"
        class="reply-textarea"
        placeholder="Reply"
      />
      <div class="action">
        <factor-btn v-if="editId" btn="primary" :loading="sending" @click="editReply()">Save &uarr;</factor-btn>
        <factor-btn v-else btn="primary" :loading="sending" @click="topicReply()">Post Reply &uarr;</factor-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, storeItem, emitEvent } from "@factor/api"
import { currentUser } from "@factor/user"
import { FactorPost } from "@factor/post/types"
import { factorInputEditor, factorAvatar, factorBtn } from "@factor/ui"
import { saveTopicReply, saveTopic } from "./request"
export default Vue.extend({
  components: { factorInputEditor, factorAvatar, factorBtn },
  props: {
    postId: { type: String, default: "" },
    editId: { type: String, default: "" }
  },
  data() {
    return {
      reply: "",
      sending: false,
      storeKey: this.editId ? this.editId : "post"
    }
  },
  computed: {
    currentUser,
    author(this: any) {
      if (this.editId) {
        const authorID =
          this.post && this.post.author && this.post.author.length > 0
            ? this.post.author[0]
            : ""
        return stored(authorID) || {}
      } else {
        return this.currentUser ? this.currentUser : {}
      }
    },
    post: {
      get(this: any): FactorPost {
        return stored(this.storeKey) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.storeKey, v)
      }
    }
  },
  mounted() {
    if (this.editId) {
      this.reply = this.post.content
    }
  },
  methods: {
    async editReply(this: any) {
      this.sending = true
      if (this.postId != this.editId) {
        await saveTopicReply(this.postId, { _id: this.editId, content: this.reply })
        this.post = { ...this.post, content: this.reply }
        emitEvent("highlight-post", this.editId)
      } else {
        await saveTopic({ _id: this.postId, content: this.reply })
      }

      this.sending = false
      this.$emit("done")
    },
    async topicReply(this: any) {
      this.sending = true

      const doc = {
        content: this.reply,
        author: [this.currentUser._id],
        _id: ""
      }

      const result = await saveTopicReply(this.postId, doc)

      if (result && result._id) {
        const embedded = this.post.embedded || []
        const embeddedCount = (this.post.embeddedCount || 0) + 1

        embedded.push(result)

        this.post = { ...this.post, embedded, embeddedCount }

        emitEvent("highlight-post", result._id)

        this.reply = ""
      }

      this.sending = false
    }
  }
})
</script>
<style lang="less">
.topic-reply {
  text-align: left;
  position: relative;
  .reply-area {
    position: relative;
    textarea {
      padding: 1rem 5rem;
    }
    .editor-input {
      text-align: left;
    }
    .editor-input .CodeMirror {
      padding-left: 5rem;
    }
    .avatar {
      position: absolute;
      z-index: 10;
      width: 3rem;
      top: 4rem;
      left: 1rem;
    }
    .action {
      padding: 1rem 0;
      text-align: right;
    }
  }
}
</style>
