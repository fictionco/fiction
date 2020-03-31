<template>
  <div class="docs-engine-post">
    <div class="doc-content">
      <div class="doc-content-pad">
        <factor-loading-ring v-if="loading" />
        <docs-entry v-else :content="content" />
      </div>
    </div>
    <div class="doc-sidebar">..sidebar..</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api"
import { getDocConfig, DocConfig } from "../util"
export default Vue.extend({
  components: {
    docsEntry: () => import("./entry.vue")
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
        this.getConfig()
      }
    }
  },
  async created() {
    this.config = (await getDocConfig(this.doc)) ?? {}
  },
  mounted() {
    this.getConfig()
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
      padding: 3rem;
    }
  }
}
</style>
