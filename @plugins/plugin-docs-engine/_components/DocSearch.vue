<template>
  <div class="doc-search-wrap px-4 sm:px-6">
    <div class="relative flex items-center">
      <svg
        class="absolute left-0 text-color-500 w-6 h-6 z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        class="
          doc-search
          w-full
          py-2
          pl-8
          text-lg
          border-0
          placeholder-gray-400
          text-gray-500
          focus:ring-0
        "
        type="search"
        placeholder="Search docs"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue"
declare global {
  interface Window {
    docsearch: any
  }
}

export default {
  setup() {
    const tries = ref<number>(0)

    const setSearch = () => {
      if (window && window.docsearch) {
        tries.value = 0
        window.docsearch({
          apiKey: "253dead4ff72565d38ab60b5689eaa94",
          indexName: "fiction-com_factor",
          inputSelector: ".doc-search",
          debug: false, // Set debug to true if you want to inspect the dropdown
        })
      } else if (tries.value < 5) {
        setTimeout(() => {
          tries.value++
          setSearch()
        }, 50)
      }
    }

    onMounted(() => {
      setSearch()
    })

    return { tries }
  },
  metaInfo: () => {
    return {
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
    }
  },
}
</script>

<style lang="less">
.doc-search-wrap {
  // ******
  // Algolia styles overwrite
  // ******
  .algolia-autocomplete {
    display: block !important;
  }
  .algolia-autocomplete .ds-dropdown-menu {
    display: block;
    font-size: 1rem;
    box-shadow: var(--dropdown-shadow);

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
