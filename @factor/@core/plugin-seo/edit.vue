<template>
  <div class="edit-post-seo">
    <div class="search-preview">
      <div class="sup">Search Preview</div>
      <div class="headline">{{ post.titleTag || post.title || "Untitled" }}</div>
      <div
        class="plink"
      >{{ $posts.getPermalink({type: post.type, permalink: post.permalink || $utils.slugify(post.title)}) }}</div>
      <div class="desc">{{ post.description || $posts.excerpt(post.content) || "No Description" }}</div>
    </div>
    <dashboard-input v-model="post.titleTag" input="factor-input-text" label="Title Meta Tag" />
    <dashboard-input
      v-model="post.description"
      input="factor-input-textarea"
      label="Description Meta Tag"
    />
    <dashboard-input
      v-model="post.featuredImage"
      input="factor-input-image-upload"
      label="Sharing Image"
      input-max="1"
    />
  </div>
</template>
<script>
export default {
  model: {
    prop: "post",
    event: "change"
  },
  props: {
    post: { type: Object, required: true }
  },
  data() {
    return {}
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