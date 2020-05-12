<template>
  <div class="docs-engine-post">
    <div class="doc-content">
      <div class="doc-content-pad">
        <factor-spinner v-if="loading" />
        <doc-entry v-else :content="content" />
      </div>
    </div>
    <div class="doc-sidebar">
      <doc-toc selector=".doc-content-pad" :sub-header="subHeaders" />
    </div>
  </div>
</template>

<script lang="ts">
import { factorSpinner } from "@factor/ui"
import { setting, toLabel } from "@factor/api"
import { getDocConfig } from "../util"
export default {
  components: {
    factorSpinner,
    docEntry: () => import("./entry.vue"),
    docToc: () => import("./toc.vue"),
  },
  data() {
    return {
      nav: setting("docsEngine.nav"),
      config: {},
      loading: false,
    }
  },
  serverPrefetch(this: any) {
    return this.getContent()
  },
  computed: {
    doc(this: any) {
      return this.$route.params.doc
    },
    content(this: any) {
      return this.config.content ?? ""
    },
    subHeaders(this: any) {
      return this.config.meta?.sub ?? false
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getContent()
      },
    },
  },
  async created() {
    this.config = (await getDocConfig(this.doc)) ?? {}
  },
  metaInfo(this: any) {
    return {
      title: this.config.meta?.title ?? toLabel(this.doc),
      description: this.config.meta?.description,
    }
  },
  mounted(this: any) {
    this.getContent()
  },
  methods: {
    async getContent(this: any): Promise<void> {
      this.loading = true
      this.config = (await getDocConfig(this.doc)) ?? {}

      this.loading = false
    },
  },
}
</script>

<style lang="less">
.docs-engine-post {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 200px;
  justify-content: flex-start;

  .doc-content {
    max-width: 760px;
    min-width: 0;
    .doc-content-pad {
      padding: 3rem 3rem 8rem;
    }
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    .doc-sidebar {
      display: none;
    }
    .doc-content {
      .doc-content-pad {
        padding: 2rem 2rem 5rem;
      }
    }
  }

  @media (max-width: 900px) {
    .doc-content {
      .doc-content-pad {
        padding: 2rem 1rem 5rem;
      }
    }
  }
}
</style>
