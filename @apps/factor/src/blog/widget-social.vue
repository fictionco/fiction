<template>
  <div class="social">
    <factor-link
      class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg facebook hover:text-white"
      :path="`https://www.facebook.com/sharer/sharer.php?u=${link}`"
    >
      <factor-icon icon="fab fa-facebook-f" />
    </factor-link>
    <factor-link
      class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg twitter hover:text-white"
      :path="`https://twitter.com/intent/tweet?text=${post.title}+${link}`"
    >
      <factor-icon icon="fab fa-twitter" />
    </factor-link>
    <factor-link
      class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg linkedin hover:text-white"
      :path="`https://www.linkedin.com/shareArticle?mini=true&url=${link}`"
    >
      <factor-icon icon="fab fa-linkedin-in" />
    </factor-link>
    <factor-link
      class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg pinterest hover:text-white"
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
    postId: { type: String, default: "" },
  },
  computed: {
    link(this: any) {
      return postLink(this.postId, { root: true })
    },
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
})
</script>
<style lang="less">
.plugin-blog {
  .social {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
    a {
      margin: 0 0.5rem;
      height: 2rem;
      width: 2rem;
      text-align: center;
      line-height: 2;
      border-radius: 0.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: 0.15s cubic-bezier(0.52, 0.01, 0.16, 1);
      color: var(--color-text);

      &:hover {
        color: #fff;
      }
    }
    .facebook:hover {
      background-color: #1877f2;
    }
    .twitter:hover {
      background-color: #1da1f2;
    }
    .linkedin:hover {
      background-color: #007bb5;
    }
    .pinterest:hover {
      background-color: #bd081c;
    }
  }
}
</style>
