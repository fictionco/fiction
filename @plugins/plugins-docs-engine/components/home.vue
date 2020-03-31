<template>
  <div class="docs-engine-home">
    <div class="docs-hero">
      <div class="docs-hero-pad">
        <div class="title-panel">
          <h1 class="title">Factor Docs</h1>
          <h3 class="sub-title">Learn how to build professional Factor apps, plugins and themes.</h3>
          <div class="search-panel">
            <div class="search-area">
              <factor-icon icon="fas fa-search" />
              <input type="search" placeholder="Search Docs" />
            </div>
          </div>
        </div>
        <search-figure />
      </div>
    </div>
    <div class="docs-groups">
      <div v-for="(group,i) in 5" :key="i" class="doc-group">
        <div class="group-title">Building Apps</div>
        <div class="group-description">Description of this stuff</div>
      </div>
    </div>
    <div class="docs-faq">
      <div class="faq-title-area">
        <div class="title">Factor Answers</div>
        <div class="sub-title">Answers to Frequently Asked Questions</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorIcon } from "@factor/ui"
export default Vue.extend({
  components: { factorIcon, searchFigure: () => import("./figure.vue") },
  metaInfo: {
    title: "Docs"
  }
})
</script>

<style lang="less">
.docs-engine-home {
  .docs-hero {
    //box-shadow: var(--panel-shadow-inset);

    //    background-image: url("../img/dot.svg");
    .docs-hero-pad {
      position: relative;
      padding: 8rem 2rem;
      margin: 0 auto;
      max-width: var(--content-width);

      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      grid-gap: 4rem;
      .title-panel {
        margin: 2rem 0;
        letter-spacing: -0.03em;
        .title {
          font-size: 4em;
          font-weight: var(--font-weight-bold, 700);
        }
        .sub-title {
          font-size: 1.5em;
          color: var(--color-text-secondary);
        }
        .search-panel {
          margin-top: 2rem;
        }
      }
      .search-area {
        font-size: 1.6em;

        margin: 0 auto;
        position: relative;
        .factor-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-placeholder);
        }
        input {
          letter-spacing: -0.03em;
          box-shadow: 0 0 0 3px rgba(0, 43, 93, 0.1);
          border-radius: 2rem;
          padding-left: 3.5rem;
          background: #fff;
          &:focus {
            border-radius: 2rem;
          }
        }
      }
    }
  }
  .docs-groups {
    padding: 2rem;
    margin: -4rem auto 5rem;
    z-index: 10;
    position: relative;
    max-width: var(--content-width);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2rem;
    .doc-group {
      background: #fff;
      font-size: 1.2em;
      box-shadow: var(--panel-shadow);
      border-radius: 5px;
      padding: 1.5rem;

      .group-title {
        font-size: 1.2em;
        font-weight: var(--font-weight-bold, 700);
      }
      .group-description {
        color: var(--color-text-secondary);
      }
      .group-actions {
        margin-top: 1rem;
      }
    }
  }
}
</style>
