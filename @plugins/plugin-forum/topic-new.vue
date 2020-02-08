<template>
  <div class="topic-new">
    <component :is="setting('forum.components.navBack')" />
    <h1 class="title">New Discussion</h1>
    <!-- <factor-avatar :url="require('./img/avatar.jpg')" /> -->
    <factor-input-wrap
      v-model="form.title"
      input="factor-input-text"
      class="topic-new-textarea"
      label="Discussion Title"
      placeholder="Topic"
    />

    <factor-input-wrap
      v-model="form.text"
      input="factor-input-editor"
      label="Text"
      description="Markdown is supported"
      placeholder="Post content"
      post-id="newTopic"
    />

    <div class="meta">
      <factor-input-wrap
        v-model="form.tags"
        class="meta-item"
        label="Tags"
        input="factor-input-tags"
      />
      <factor-input-wrap
        v-model="form.category"
        class="meta-item"
        label="Category"
        input="factor-input-select"
        placeholder="Sort"
        :list="['latest', 'popular']"
      />
    </div>
    <div class="action">
      <factor-btn btn="primary">Post Discussion</factor-btn>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api/settings"
import { factorInputWrap, factorBtn } from "@factor/ui"
export default Vue.extend({
  components: {
    factorInputWrap,
    factorBtn
  },
  data() {
    return {
      form: {}
    }
  },
  metaInfo() {
    return {
      title: "New Topic",
      description: "Start a new topic discussion on the forum"
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.topic-new {
  max-width: 650px;
  margin: 0 auto;
  font-size: 1.2em;

  .title {
    font-size: 1.3em;
    letter-spacing: -0.02em;
    font-weight: var(--font-weight-bold, 700);
    margin-bottom: 2rem;
  }
  .meta {
    display: flex;
    .meta-item {
      margin-right: 2rem;
    }
  }
}
</style>
