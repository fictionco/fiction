<template>
  <div class="transition-all flex justify-center mb-12">
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
</style>
