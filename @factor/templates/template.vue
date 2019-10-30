<template>
  <div class="page">
    <div v-if="post.loading" class="post-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="post._id">
      <component :is="templateLoader" :post-id="post._id" />
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
import { getPageTemplates } from "@factor/templates"
import { stored } from "@factor/tools"
export default {
  data() {
    return {
      comp: null,
      settings: ""
    }
  },
  computed: {
    templateLocation() {
      return this.post.template ? this.post.template : "default"
    },
    templateLoader() {
      const selected = getPageTemplates().find(_ => _._id == this.templateLocation)

      return selected && selected.component
        ? selected.component
        : () => import("./tpl-default.vue")
    },

    post() {
      return stored("post") || {}
    }
  }
}
</script>,
<style lang="less">
.page {
  .post-loading {
    min-height: 30vh;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>