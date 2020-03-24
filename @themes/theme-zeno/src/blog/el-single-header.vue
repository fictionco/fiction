<template>
  <div class="entry-header">
    <div class="header-bg bg-cover bg-center bg-purple-900 text-center">
      <div class="max-w-3xl mx-auto px-8 py-8">
        <component
          :is="setting('blog.components.returnLink')"
          :post-id="postId"
          class="custom-uppercase text-purple-400 pt-6"
        />
        <h1
          class="pt-2 font-normal tracking-tight leading-tight text-3xl text-gray-100 md:text-5xl"
        >
          <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
        </h1>

        <h3 class="my-4 text-xl text-gray-600">{{ post.synopsis }}</h3>

        <factor-post-edit :post-id="post._id" class="block text-purple-400" />
      </div>
    </div>
    <div class="bg-gray-100">
      <div class="max-w-3xl mx-auto">
        <div class="flex justify-center items-center custom-uppercase mb-0 py-4 text-gray-600">
          <span class="inline-block">{{ standardDate(post.date) }}</span>
          <div
            v-for="authorId in post.author"
            :key="authorId"
            class="flex justify-center items-center"
          >
            <factor-avatar :user="getPost(authorId)" class="ml-8" />
            <span
              class="ml-2 mb-0"
              itemprop="author"
              itemscope
              itemtype="http://schema.org/Person"
            >{{ getPost(authorId).displayName }}</span>
          </div>
        </div>
      </div>
    </div>
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="post.title"
      class="max-w-full mb-12 bg-cover bg-center bg-no-repeat md:my-12 md:max-w-4xl md:mx-auto"
    />
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink, factorAvatar } from "@factor/ui"
import { postLink, standardDate, setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorAvatar, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    url: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    avatar(this: any) {
      return stored(this.post.avatar) || {}
    },
    avatarUrl(this: any) {
      return this.avatar.url || ""
    },
    featuredImage(this: any) {
      const style = {
        backgroundImage: `url(${this.avatarUrl})`
      }
      return style
    }
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    },
    postLink,
    setting,
    standardDate
  }
})
</script>
<style lang="less">
.plugin-blog {
  .avatar {
    .thumb {
      border-radius: 50%;
    }
  }
  .single-entry .entry-header {
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;

    .header-bg {
      background-image: url(../img/light-pattern.svg);
    }
  }
}
</style>
