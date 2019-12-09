<template>
  <div class="return-link">
    <factor-link class="back label label-yellow" :path="setting('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("blog.returnLinkText") || "All Articles"
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.return-link {
  margin-bottom: 2rem;

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: var(--font-weight-normal, 400);
    &.label-yellow {
      color: #f3c101;
      &:hover {
        color: #f3c101;
        opacity: 0.7;
      }
    }
  }
}
</style>
