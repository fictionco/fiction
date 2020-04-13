<template>
  <div class="docs-entry">
    <factor-highlight-code>
      <div v-formatted-text="content" class="doc-container" />
    </factor-highlight-code>
  </div>
</template>
<script lang="ts">
import Vue from "vue"

import { factorHighlightCode } from "@factor/plugin-highlight-code"
export default Vue.extend({
  components: {
    factorHighlightCode,
  },
  props: {
    content: { type: String, default: "" },
  },
})
</script>
<style lang="less">
.docs-entry {
  @import "~@factor/ui/css/standard-entry.less";

  .doc-container {
    > p:first-of-type {
      font-size: 1.2em;
      font-weight: 600;
    }
  }

  .features-comparison {
    td {
      text-align: center;
      min-width: 120px;
      &:first-child {
        min-width: 160px;
        text-align: left;
        display: flex;
      }
      i {
        text-align: center;
        width: 2em;
        font-style: normal;
        display: inline-block;
        flex-shrink: 0;
      }
    }
  }

  figure {
    margin: 2em 0;
    text-align: center;

    figcaption {
      margin-top: 0.1em;
      opacity: 0.3;
      text-align: center;
    }

    > a {
      display: block;
    }

    img {
      background-image: url("../img/dot.svg");
      max-width: 100%;
      margin: 0 auto;
      box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.25), 0 1px 3px -1px rgba(0, 0, 0, 0.3);
      // box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15),
      //   0 1px 2px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease-in-out;
      border-radius: 5px;

      &:hover {
        // box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15),
        //   0 1px 15px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
          0 3px 7px -3px rgba(0, 0, 0, 0.3);
        transform: translateY(-1px);
      }
    }
  }
}
</style>
