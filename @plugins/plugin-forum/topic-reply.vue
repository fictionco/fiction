<template>
  <div class="topic-reply">
    <div class="reply-area">
      <factor-avatar :post-id="currentUser ? currentUser.avatar : ''" />
      <factor-input-editor
        id="topic-reply"
        v-model="reply"
        class="reply-textarea"
        placeholder="Reply"
      />
      <div class="action">
        <factor-btn btn="primary" :loading="sending" @click="topicReply()">Reply</factor-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, storeItem } from "@factor/api"
import { currentUser } from "@factor/user"
import { FactorPost } from "@factor/post/types"
import { factorInputEditor, factorAvatar, factorBtn } from "@factor/ui"
import { saveTopicReply } from "./request"
export default Vue.extend({
  components: { factorInputEditor, factorAvatar, factorBtn },
  props: {
    postId: { type: String, default: "" }
  },
  data() {
    return {
      reply: "",
      sending: false
    }
  },
  metaInfo: () => {
    return { title: "Post" }
  },
  computed: {
    currentUser,
    post: {
      get(this: any): FactorPost {
        return stored("post") || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem("post", v)
      }
    }
  },
  methods: {
    async topicReply(this: any) {
      this.sending = true

      const result = await saveTopicReply(this.postId, {
        content: this.reply,
        author: [this.currentUser._id]
      })

      const embedded = this.post.embedded
      embedded.push(result)
      this.post = { ...this.post, embedded }

      this.reply = ""

      this.sending = false
    }
  }
})
</script>
<style lang="less">
.topic-reply {
  position: relative;
  display: grid;
  grid-template-columns: 5rem 1fr;
  grid-template-areas: ". reply";
  .reply-area {
    grid-area: reply;
    position: relative;
    textarea {
      padding: 1rem 5rem;
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
