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

      return tpls.find(_ => _.value == this.templateLocation).component
    },

    post() {
      return this.$store.getters["getItem"]("post") || {}
    }
  },

  async mounted() {
    const tpls = this.$templates.getPageTemplates()

    const c = await tpls
      .find(_ => _.value == this.templateLocation)
      .component()
  },
  methods: {}
}
</script>,