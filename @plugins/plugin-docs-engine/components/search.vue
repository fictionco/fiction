<template>
  <div class="search-area">
    <factor-icon icon="fas fa-search" />
    <input class="doc-search" type="search" placeholder="Search Docs" />
  </div>
</template>

<script lang="ts">
import { factorIcon } from "@factor/ui"
export default {
  components: { factorIcon },
  data() {
    return {
      tries: 0,
    }
  },
  mounted() {
    this.setSearch()
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
  methods: {
    setSearch(this: any) {
      if (window && window.docsearch) {
        this.tries = 0
        window.docsearch({
          apiKey: "253dead4ff72565d38ab60b5689eaa94",
          indexName: "fiction-com_factor",
          inputSelector: ".doc-search",
          debug: false, // Set debug to true if you want to inspect the dropdown
        })
      } else if (this.tries < 5) {
        setTimeout(() => {
          this.tries++
          this.setSearch()
        }, 50)
      }
    },
  },
}
</script>

<style lang="less">
.search-area {
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
    border-radius: none;
    box-shadow: none;

    padding: 1em 1em 1em 3rem;
    background: #fff;
    transition: 0.2s all;
    &:focus {
      outline: none;
    }
  }
  .algolia-autocomplete {
    display: block !important;
  }
  .algolia-autocomplete .ds-dropdown-menu {
    font-size: 1rem;
    box-shadow: var(--dropdown-shadow);

    display: block;
    @media (max-width: 700px) {
      min-width: 350px;
      max-width: calc(~"100%-2em");
    }
  }
  .algolia-docsearch-footer {
    opacity: 0.15;
  }

  .algolia-docsearch-suggestion {
    [class^="algolia-docsearch-suggestion--"] {
      color: var(--color-text);
    }
    div.algolia-docsearch-suggestion--wrapper {
      margin: 0.5rem 0;
    }

    div.algolia-docsearch-suggestion--subcategory-column {
      display: block;
      @media (max-width: 900px) {
        float: none;
      }

      opacity: 1;
      > span {
        color: var(--color-text-secondary);
      }
      &::after {
        opacity: 0;
      }
    }
    .algolia-docsearch-suggestion--title {
      color: var(--color-text);
    }
    .algolia-docsearch-suggestion--text {
      .algolia-docsearch-suggestion--highlight {
        box-shadow: inset 0 -2px 0 var(--color-primary);
      }
    }
  }
}
</style>
