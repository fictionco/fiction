<template>
  <div class="edit-post-seo">
    <div class="search-preview">
      <div class="sup">Search Preview</div>
      <div class="headline">{{ post.titleTag || post.title || "Untitled" }}</div>
      <div class="plink">{{ link }}</div>
      <div
        class="desc"
      >{{ post.descriptionTag || post.subTitle || $utils.excerpt(post.content) || "No Description" }}</div>
    </div>
    <dashboard-input v-model="post.titleTag" input="factor-input-text" label="Title Meta Tag" />
    <dashboard-input
      v-model="post.descriptionTag"
      input="factor-input-textarea"
      label="Description Meta Tag"
    />
    <dashboard-input
      v-model="post.shareImage"
      input="factor-input-image-upload"
      label="Sharing Image"
      :max="1"
    />
  </div>
</template>
<script>
export default {
  // model: {
  //   prop: "post",
  //   event: "change"
  // },
  props: {
    //   post: { type: Object, required: true },
    postId: { type: String, required: true }
  },
  data() {
    return {}
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    // post: {
    //   get() {
    //     return this.$store.val(this.postId) || {}
    //   },
    //   set(v) {
    //     this.$store.add(this.postId, v)
    //   }
    // },
    link() {
      return this.$post.link(this.postId, { root: true })
    }
  },
  watch: {
    // post: {
    //   handler: function(v) {
    //     this.post = v
    //   },
    //   deep: true
    // }
  }
}
</script>
<style lang="less">
.edit-post-seo {
  .search-preview {
    line-height: 1.5;
    padding: 0em 0 2em;
    .sup {
      opacity: 0.3;
      margin-bottom: 1em;
    }
    .headline {
      line-height: 1.3;
      color: #1b1ba8;
      font-size: 1.3em;
    }
    .desc {
      opacity: 0.7;
    }
    .plink {
      color: #0a6524;
    }
  }
}
</style>