<template>
  <div class="search-area">
    <factor-icon icon="fas fa-search" />
    <input class="doc-search" type="search" placeholder="Search Docs" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorIcon } from "@factor/ui"
export default Vue.extend({
  components: { factorIcon },
  mounted() {
    if (window && window.docsearch) {
      window.docsearch({
        apiKey: "253dead4ff72565d38ab60b5689eaa94",
        indexName: "fiction-com_factor",
        inputSelector: ".doc-search",
        debug: false, // Set debug to true if you want to inspect the dropdown
      })
    }
  },
  metaInfo: {
    link: [
      {
        vmid: "docsearch",
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css",
      },
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js",
      },
    ],
  },
})
</script>

<style lang="less">
.search-area {
  max-width: 400px;
  font-size: 1.3em;

  position: relative;
  .factor-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-placeholder);
    z-index: 10;
  }
  input[type="search"] {
    letter-spacing: -0.03em;
    box-shadow: var(--panel-shadow);
    border-radius: 2rem;
    padding-left: 3.5rem;
    background: #fff;
    transition: 0.2s all;
    &:focus {
      outline: none;
      background: rgba(0, 43, 93, 0.03);
    }
  }
  .algolia-autocomplete .ds-dropdown-menu {
    font-size: 1rem;
    box-shadow: var(--dropdown-shadow);
  }
}
</style>
