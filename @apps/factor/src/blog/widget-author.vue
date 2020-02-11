<template>
  <div class="widget-author">
    <div class="author-wrap">
      <div v-for="authorId in post.author" :key="authorId" class="author">
        <factor-avatar :post-id="getPost(authorId).avatar" />
        <span
          class="author-name"
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
    postId: { type: String, default: "" }
  },
  computed: {
    postSet() {
      return !isEmpty(this.post) ? true : false
    },
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
.plugin-blog {
  .widget-author {
    margin-top: auto;
    padding: 3rem 2rem 2rem;
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
        .author-name {
          display: inline-flex;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          @media (max-width: 767px) {
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>
