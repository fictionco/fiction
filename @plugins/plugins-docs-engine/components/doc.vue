<template>
  <div class="docs-engine-post">
    <div class="doc-content">
      <div class="doc-content-pad">
        <factor-loading-ring v-if="loading" />
        <doc-entry v-else :content="content" />
      </div>
    </div>
    <div class="doc-sidebar">
      <doc-toc selector=".doc-content-pad" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorLoadingRing } from "@factor/ui"
import { setting, toLabel } from "@factor/api"
import { getDocConfig } from "../util"
export default Vue.extend({
  components: {
    factorLoadingRing,
    docEntry: () => import("./entry.vue"),
    docToc: () => import("./toc.vue")
  },
  data() {
    return {
      nav: setting("docsEngine.nav"),
      config: {},
      loading: false
    }
  },
  serverPrefetch() {
    return this.getContent()
  },
  computed: {
    doc(this: any) {
      return this.$route.params.doc
    },
    content(this: any) {
      return this.config.content ?? ""
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getContent()
      }
    }
  },
  async created() {
    this.config = (await getDocConfig(this.doc)) ?? {}
  },
  metaInfo(this: any) {
    return {
      title: this.config.meta?.title ?? toLabel(this.doc),
      description: this.config.meta?.description
    }
  },
  mounted() {
    this.getContent()
  },
  methods: {
    async getContent(this: any): Promise<void> {
      this.loading = true
      this.config = (await getDocConfig(this.doc)) ?? {}

      this.loading = false
    }
  }
})
</script>

<style lang="less">
.docs-engine-post {
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: auto 200px;
  justify-content: flex-start;

  .doc-content {
    max-width: 800px;
    .doc-content-pad {
      padding: 3rem 3rem 8rem;
    }
  }
}
</style>
