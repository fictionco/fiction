<template>
  <div class="single-entry">
    <div class="topic-header">
      <div class="text">
        <h1 class="title">The Title</h1>
        <div class="meta">
          <component :is="setting('forum.components.topicNumberPosts')" class="meta-item" />
          <component :is="setting('forum.components.topicTags')" class="meta-item" />
        </div>
      </div>
      <div class="actions">
        <factor-btn btn="default">Subscribe</factor-btn>
        <factor-btn btn="primary" @click="focusReply()">Reply</factor-btn>
      </div>
    </div>
    <div class="content-area">
      <div class="topic-posts">
        <div v-for="(item, index) in 4" :key="index" class="topic-post">
          <div class="topic-post-avatar">
            <factor-avatar :url="require('./img/avatar.jpg')" />
          </div>
          <div class="topic-post-content">
            <div class="topic-post-meta">
              <component :is="setting('forum.components.topicAuthor')" class="meta-item" />
              <component :is="setting('forum.components.topicTimeAgo')" class="meta-item" />
              <component :is="setting('forum.components.topicActions')" class="meta-item" />
            </div>
            <div
              class="text"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc scelerisque nisl a massa bibendum, nec sollicitudin felis varius. Praesent ligula tellus, elementum vel leo a, tristique convallis justo. Nam sodales mauris et justo efficitur, eu maximus tellus tincidunt. Donec ac est in libero ornare rutrum. Nullam ac dolor et augue bi</div>
          </div>
        </div>
        <component :is="setting('forum.components.topicReply')" />
      </div>
    </div>

    <!-- <div v-if="!isEmpty(post)">
      <component
        :is="setting(`forum.components.${comp}`)"
        v-for="(comp, i) in setting('forum.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <factor-error-404 v-else />-->
  </div>
</template>
<script lang="ts">
import { factorAvatar, factorBtn } from "@factor/ui"
import {
  isEmpty,
  setting,
  stored,
  titleTag,
  descriptionTag,
  shareImage
} from "@factor/api"

import Vue from "vue"
export default Vue.extend({
  components: { factorAvatar, factorBtn },
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id)
    }
  },
  computed: {
    post() {
      return stored("post") || {}
    }
  },

  methods: {
    isEmpty,
    setting,
    focusReply() {
      const el: HTMLFormElement | null = document.querySelector("#topic-reply")
      if (el) {
        el.focus()
      }
    }
  }
})
</script>
<style lang="less">
.topic-header {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 300px);

  .title {
    font-size: 2em;
    line-height: 1.1;
    margin-bottom: 1rem;
    font-weight: var(--font-weight-bold, 700);
  }
  .actions {
    text-align: right;
    align-self: center;
    .factor-btn {
      margin: 0 0.5rem;
    }
  }
  .meta {
    display: flex;
    .meta-item {
      margin-right: 1rem;
    }
  }
  padding-bottom: 1rem;
}
.content-area {
  display: grid;
  grid-template-columns: 1fr 100px;
}
.topic-posts {
  padding: 1rem 0;

  .topic-post {
    display: grid;
    grid-template-columns: 3rem 1fr;
    grid-gap: 2rem;
    margin-bottom: 3rem;
    .text {
      font-size: 1.2em;
      line-height: 1.6;
      max-width: 650px;
    }
  }
  .topic-post-meta {
    display: flex;
    margin-bottom: 0.5rem;
    .meta-item {
      margin-right: 1rem;
    }
  }
}
</style>
