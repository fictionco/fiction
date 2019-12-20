<template>
  <div class="author-bio">
    <div v-for="_id in post.author" :key="_id" class="author-card">
      <factor-avatar :post-id="getPost(_id).avatar" width="4em" />
      <div class="text">
        <div class="sup">Written By</div>
        <div class="name">{{ getPost(_id).displayName }}</div>
        <div v-if="getPost(_id).about" class="bio">{{ getPost(_id).about }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorAvatar } from "@factor/ui"
import { stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorAvatar },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    }
  }
})
</script>
<style lang="less">
.author-bio {
  max-width: 800px;
  margin: 0 auto;
}
.author-card {
  display: flex;
  align-items: center;
  padding: 1.5em 0;

  margin-right: 0;
  .avatar {
    margin-right: 20px;
    flex-shrink: 0;
  }
  .text {
    line-height: 1.4;
    .sup {
      font-size: 1rem;
      text-transform: uppercase;
      opacity: 0.3;
      line-height: 1.2;
    }
    .name {
      font-size: 1.5em;
      font-weight: var(--font-weight-bold);
    }
    .bio {
      font-size: 1.3em;
      margin-top: 0.5em;
      opacity: 0.5;
    }
  }
}
</style>
