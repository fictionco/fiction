<template>
  <div class="docs-engine-home">
    <div class="docs-hero-area">
      <div class="docs-hero">
        <div class="docs-hero-pad docs-content-area">
          <div class="title-panel docs-hero">
            <h1 class="title">Documentation</h1>
            <h3
              class="sub-title"
            >Learn how to ship professional Factor apps, build plugins, and create themes.</h3>
            <div class="search-panel">
              <div class="search-area">
                <factor-icon icon="fas fa-search" />
                <input type="search" placeholder="Search Docs" />
              </div>
            </div>
          </div>
          <div class="icon-figure">
            <figure-icon icon="doc" class="main" color="white" />
          </div>
        </div>
      </div>
    </div>
    <div class="docs-groups-area docs-content-area">
      <div class="docs-groups">
        <div v-for="(group,i) in 5" :key="i" class="doc-group">
          <figure-icon icon="widgets" class="group-icon" color="primary" />
          <div class="group-text">
            <div class="group-title">Building Apps</div>
            <div class="group-description">Description of this stuff</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="docs-faq docs-content-area">
      <div class="faq-title-area docs-hero">
        <div class="title">Factor Answers</div>
        <div class="sub-title">Answers to Frequently Asked Questions</div>
      </div>
    </div>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorIcon } from "@factor/ui"
export default Vue.extend({
  components: { factorIcon, figureIcon: () => import("./figure-icon.vue") },
  metaInfo: {
    title: "Docs"
  }
})
</script>

<style lang="less">
.docs-engine-home {
  padding-bottom: 12 rem;
  .docs-hero {
    .title {
      font-size: 2.5em;
      line-height: 1.1;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 1rem;
    }
    .sub-title {
      font-size: 1.5em;
      color: var(--color-text-secondary);
    }
  }
  .docs-content-area {
    max-width: var(--content-width);
    padding: 3rem;
    .docs-content-area-pad {
      padding: 0 2rem;
    }
  }
  .docs-hero-area {
    .docs-hero-pad {
      position: relative;

      display: grid;
      grid-template-columns: 1fr 8em;

      grid-gap: 10rem;
      .icon-figure {
        margin-bottom: 1rem;
        text-align: right;
        .docs-figure-icon {
          border-radius: 6px;
          padding: 1rem;
          box-shadow: var(--panel-shadow);

          width: 4rem;
          height: 4rem;
          background: var(--color-primary);
        }
      }

      .title-panel {
        letter-spacing: -0.03em;

        border-radius: 7px;
        .title {
          font-size: 2.5em;
          line-height: 1.1;
          font-weight: var(--font-weight-bold, 700);
          margin-bottom: 1rem;
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
        max-width: 400px;
        font-size: 1.3em;

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
      }
    }
  }
  .docs-groups-area {
    z-index: 10;
    position: relative;

    .docs-groups {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;

      grid-gap: 2rem;
    }
    .doc-group {
      min-width: 0;
      background: #fff;
      font-size: 1em;
      box-shadow: var(--panel-shadow);
      border-radius: 5px;
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 3rem 1fr;
      svg {
        width: 2rem;
        height: 2rem;
      }
      .group-title {
        font-size: 1.2em;
        line-height: 1.1;
        font-weight: var(--font-weight-bold, 700);
        margin-bottom: 0.5rem;
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
