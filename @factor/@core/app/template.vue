<template>
  <div class="page">
    <div v-if="!$lodash.isEmpty(post)">
      <component :is="templateLoader" :post="post" />
    </div>
    <page-error v-else />
  </div>
</template>
<script>
export default {
  components: {
    "page-error": () => import("#/page-error")
  },
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
      const tpls = this.$posts.getPageTemplates()

      return tpls.find(_ => _.value == this.templateLocation).component
    },

    testTemplate() {
      const tpls = this.$posts.getPageTemplates()

      return tpls.find(_ => _.value == this.templateLocation).component()
    },
    post() {
      return this.$store.getters["getItem"]("post") || {}
    }
  },

  async mounted() {
    const tpls = this.$posts.getPageTemplates()

    const c = await tpls
      .find(_ => _.value == this.templateLocation)
      .component()
  },
  methods: {}
}
</script>,