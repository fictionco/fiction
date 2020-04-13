<template>
  <div class="widget-author mt-auto pt-12 pb-8 px-8">
    <div class="author-wrap">
      <div v-for="authorId in post.author" :key="authorId" class="author">
        <factor-avatar :user="getPost(authorId)" />
        <span
          class="inline-flex items-center custom-uppercase mb-0"
          itemprop="author"
          itemscope
          itemtype="http://schema.org/Person"
        >{{ getPost(authorId).displayName }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorAvatar } from "@factor/ui"
import { isEmpty, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorAvatar },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    postSet() {
      return !isEmpty(this.post) ? true : false
    },
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    },
  },
})
</script>
<style lang="less">
.plugin-blog {
  .widget-author {
    .author-wrap {
      font-size: 0.9em;
      font-weight: 600;

      .author {
        display: flex;
        margin-right: 1em;
        .avatar {
          width: 2rem;
          display: block;
          margin-right: 10px;
          float: left;
          .thumb {
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
