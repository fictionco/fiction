<template>
  <div class="widget-author-date">
    <div class="author-date">
      <span class="date">{{ standardDate(post.date) }}</span>
      <span class="sep">/</span>
      <div v-for="authorId in post.author" :key="authorId" class="author">
        <span
          class="name"
          itemprop="author"
          itemscope
          itemtype="http://schema.org/Person"
        >{{ getPost(authorId).displayName }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { isEmpty, standardDate, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
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
        margin: 0 0.5em;
        opacity: 0.3;
      }
    }
  }
}
</style>
