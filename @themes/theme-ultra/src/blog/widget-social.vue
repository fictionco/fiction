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
    position: fixed;
    top: 50%;
    right: 1em;
    transform: translate(0, -50%);
    z-index: 40;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0;
    background: #fff;
    border-radius: 0.5rem;
    border: 1px solid rgba(17, 16, 16, 0.1);
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

    &:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    a.social {
      display: inline-block;
      //width: 32px;
      //height: 32px;
      height: auto;
      font-size: 1.2em;
      text-align: center;
      line-height: 32px;
      padding: 0.5rem 1rem;
      color: var(--color-placeholder);
      margin-right: 0;

      &:hover {
        background: #f6f6f6;
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
    @media (max-width: 900px) {
      position: relative;
      top: 0;
      right: 0;
      transform: translate(0, 0);
      grid-template-columns: repeat(4, 45px);
      grid-gap: 1.5em;
      border: none;
      box-shadow: none;
      background: transparent;
      &:hover {
        box-shadow: none;
      }
      a.social {
        width: 45px;
        padding: 0.5rem;
        background: #fff;
        border-radius: 0.5rem;
        box-shadow: 0 3px 30px rgba(0, 0, 0, 0.15), 0 5px 5px rgba(0, 0, 0, 0.05);
        &:hover {
          background: #fff;
        }
      }
    }
  }
}
</style>
