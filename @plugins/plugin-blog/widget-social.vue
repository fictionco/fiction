<template>
  <div class="social-share">
    <factor-link
      class="social facebook"
      :path="`https://www.facebook.com/sharer/sharer.php?u=${link}`"
    >
      <factor-icon icon="fab fa-facebook-f" />
    </factor-link>
    <factor-link
      class="social twitter"
      :path="`https://twitter.com/intent/tweet?text=${post.title}+${link}`"
    >
      <factor-icon icon="fab fa-twitter" />
    </factor-link>
    <factor-link
      class="social linkedin"
      :path="`https://www.linkedin.com/shareArticle?mini=true&url=${link}`"
    >
      <factor-icon icon="fab fa-linkedin-in" />
    </factor-link>
    <factor-link
      class="social pinterest"
      :path="`https://pinterest.com/pin/create/button/?url=${link}`"
    >
      <factor-icon icon="fab fa-pinterest" />
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { stored } from "@factor/app/store"
import { postLink } from "@factor/api/permalink"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    link(this: any) {
      return postLink(this.postId, { root: true })
    },
    post(this: any) {
      return stored(this.postId) || {}
    }
  }
})
</script>
<style lang="less">
.plugin-blog {
  .social-share {
    display: grid;
    grid-template-columns: repeat(4, 32px);
    grid-gap: 1em;
    margin-bottom: 1em;
    a.social {
      display: inline-block;
      width: 32px;
      height: 32px;
      font-size: 1.2em;
      text-align: center;
      line-height: 32px;
      color: var(--color-placeholder);
      border-radius: 5px;
      box-shadow: var(--box-shadow-input);
      &:not(:nth-child(1)) {
        margin-right: 0.5em;
      }
      &.facebook:hover {
        color: #1877f2;
      }
      &.twitter:hover {
        color: #1da1f2;
      }
      &.linkedin:hover {
        color: #007bb5;
      }
      &.pinterest:hover {
        color: #bd081c;
      }
    }
  }
}
</style>
