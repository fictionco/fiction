<template>
  <div class="topic-reply">
    <factor-avatar :url="require('./img/avatar.jpg')" />
    <factor-input-editor
      id="topic-reply"
      class="reply-textarea"
      post-id="topic-reply"
      placeholder="Reply"
    />
    <div class="action">
      <factor-btn btn="primary">Reply</factor-btn>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { factorInputEditor, factorAvatar, factorBtn } from "@factor/ui"
export default Vue.extend({
  components: { factorInputEditor, factorAvatar, factorBtn },
  metaInfo: () => {
    return { title: "Post" }
  }
})
</script>
<style lang="less">
.topic-reply {
  max-width: 800px;
  position: relative;
  textarea {
    padding: 1rem 5rem;
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
</style>
