<template>
  <div class="social-share">
    <factor-link
      class="text-white facebook"
      :path="`https://www.facebook.com/sharer/sharer.php?u=${link}`"
    >
      <factor-icon icon="facebook" />
    </factor-link>
    <factor-link
      class="text-white twitter"
      :path="`https://twitter.com/intent/tweet?text=${post.title}+${link}`"
    >
      <factor-icon icon="twitter" />
    </factor-link>
    <factor-link
      class="btn-link linkedin"
      :path="`https://www.linkedin.com/shareArticle?mini=true&url=${link}`"
    >
      <factor-icon icon="linkedin" />
    </factor-link>
    <factor-link
      class="btn-link pinterest"
      :path="`https://pinterest.com/pin/create/button/?url=${link}`"
    >
      <factor-icon icon="pinterest" />
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { stored } from "@factor/app/store"
import { postLink } from "@factor/api/permalink"

export default {
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    link() {
      return postLink(this.postId, { root: true })
    },
    post() {
      return stored(this.postId) || {}
    }
  }
}
</script>
<style lang="less">
.social-share {
  margin: 1.5rem 0;
  .btn-link {
    margin-right: 0.5em;
    font-size: 1.1em;
    line-height: 1;
    color: #fff;
    padding: 0.5em 0.75em;
    border-radius: 5px;
    width: 3em;
    text-align: center;
    &.facebook {
      background: #1877f2;
    }
    &.twitter {
      background: #1da1f2;
    }
    &.linkedin {
      background: #007bb5;
    }
    &.pinterest {
      background: #bd081c;
    }
    &:hover {
      color: #fff;
      opacity: 0.7;
    }
  }
}
</style>
