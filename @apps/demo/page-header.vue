<template>
  <div class="page-header">
    <h1 v-if="title">{{ title }}</h1>
    <h3 v-if="subTitle">{{ subTitle }}</h3>
    <div v-if="urlExample || urlOverview" class="actions">
      <factor-link v-if="urlOverview" :path="urlOverview" btn="primary">Overview</factor-link>
      <factor-link v-if="urlExample" :path="urlExample" btn="default">
        <factor-icon icon="fab fa-github" />
        <span>Example</span>
      </factor-link>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
export default {
  components: { factorLink, factorIcon },
  props: {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    urlExample: { type: String, default: "" },
    urlOverview: { type: String, default: "" },
  },
}
</script>
<style lang="postcss" scoped>
.page-header {
  text-align: center;
  line-height: 1.1;
  padding: 1em;
  margin: 2em;

  h1 {
    font-size: 1.7em;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1.3em;
    color: var(--color-text-secondary);
  }
  .actions {
    margin: 2em 0;
    .factor-link {
      margin: 0 0.5rem;
    }
  }
}
</style>
