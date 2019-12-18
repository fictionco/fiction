<template>
  <div class="work-return-link">
    <factor-link class="back label label-primary" :path="setting('work.indexRoute')">
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
      return setting("work.returnLinkText") || "Back"
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.work-return-link {
  margin-bottom: 2rem;

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: var(--font-weight-normal, 400);
    &.label-primary {
      color: var(--color-primary);
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
