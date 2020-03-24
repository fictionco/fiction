<template>
  <div class="author-bio">
    <div v-for="_id in post.author" :key="_id" class="author-card">
      <factor-avatar :user="getPost(_id)" width="4em" />
      <div class="text">
        <div class="sup">Written By</div>
        <div
          class="name"
          itemprop="author"
          itemscope
          itemtype="http://schema.org/Person"
        >{{ getPost(_id).displayName }}</div>
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
    getPost(_id: string) {
      return stored(_id) || {}
    }
  }
})
</script>
<style lang="less">
.plugin-blog {
  .author-card {
    margin-top: 2rem;
    display: flex;
    align-items: flex-start;
    padding: 1em 0;
    .avatar {
      width: 4rem;
      margin-right: 1.5em;
      flex-shrink: 0;
    }
    .text {
      .sup {
        font-size: 1rem;
        line-height: 1.2;
        text-transform: uppercase;
        opacity: 0.3;
      }
      .name {
        font-size: 1.5em;
        line-height: 1.7;
        font-weight: 600;
      }
      .bio {
        font-size: 1.2em;
        line-height: 1.7em;
        margin-top: 0.5em;
      }
    }
  }
}
</style>
