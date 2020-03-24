<template>
  <div class="widget-author-date">
    <div class="author-date">
      <div v-for="authorId in post.author" :key="authorId" class="author">
        <factor-avatar :user="getPost(authorId)" />
        <span
          class="name"
          itemprop="author"
          itemscope
          itemtype="http://schema.org/Person"
        >{{ getPost(authorId).displayName }}</span>
      </div>
      <span class="sep">on</span>
      <span class="date">{{ standardDate(post.date) }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { factorAvatar } from "@factor/ui"
import { isEmpty, standardDate, stored } from "@factor/api"
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
    },
    standardDate
  }
})
</script>
<style lang="less">
.plugin-blog {
  .widget-author-date {
    .author-date {
      display: flex;
      align-items: center;
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
        }
        .name {
          display: inline-flex;
          align-items: center;
          font-weight: 600;
        }
      }
      .sep {
        font-weight: 500;
        font-style: italic;
        margin: 0 1em 0 0;
        opacity: 0.8;
      }
    }
  }
}
</style>
