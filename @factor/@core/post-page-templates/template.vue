<template>
  <div class="page">
    <div v-if="!$lodash.isEmpty(post)">
      <component :is="templateLoader" :post="post" />
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
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
      const tpls = this.$templates.getPageTemplates()
      console.log("tpls", tpls)
      const selected = tpls.find(_ => _._id == this.templateLocation)

      return selected && selected.component
        ? selected.component
        : () => import("./tpl-default")
    },

    post() {
      return this.$store.getters["getItem"]("post") || {}
    }
  }
}
</script>,