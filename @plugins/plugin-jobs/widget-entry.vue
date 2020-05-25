<template>
  <div class="jobs-entry">
    <factor-highlight-code>
      <div v-formatted-text="rendered" class="entry-container" />
    </factor-highlight-code>
  </div>
</template>
<script lang="ts">
import { renderMarkdown } from "@factor/api/markdown"
import { stored } from "@factor/api"
import { factorHighlightCode } from "@factor/plugin-highlight-code"
export default {
  components: {
    factorHighlightCode,
  },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    variables(this: any) {
      const vars = {}
      this.post.images.forEach((imageId: string) => {
        const img = stored(imageId) || {}
        vars[imageId] = img.url || ""
      })
      return vars
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content, {
        variables: true,
      })
    },
  },
}
</script>
<style lang="less">
.jobs-entry {
  @import "~@factor/ui/css/standard-entry.less";
  margin: 2em 0;
  .entry-container {
    > p:first-of-type {
      font-size: 1.2em;
      font-weight: 600;
    }
  }
}
</style>
