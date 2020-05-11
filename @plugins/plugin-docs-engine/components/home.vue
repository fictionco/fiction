<template>
  <div class="docs-engine-home">
    <div class="docs-hero-area">
      <div class="docs-hero">
        <div class="docs-hero-pad docs-content-area">
          <div class="title-panel docs-hero">
            <h1 class="title">Documentation</h1>
            <h3 class="sub-title">
              Learn how to ship professional Factor apps, build plugins, and create
              themes.
            </h3>
          </div>
          <div class="icon-figure-stage">
            <div class="icon-figure" :class="loaded ? 'loaded' : ''">
              <figure-icon icon="doc" class="main" color="white" />
              <figure-icon icon="doc" class="main" color="white" />
              <figure-icon icon="doc" class="main" color="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="docs-groups-area docs-content-area">
      <div class="docs-groups">
        <factor-link v-for="(group, i) in boxes" :key="i" class="doc-group" :path="group.path">
          <figure-icon :icon="group.boxIcon || 'apps'" class="group-icon" color="primary" />
          <div class="group-text">
            <div class="group-title">{{ group.title }}</div>
            <div class="group-description">{{ group.description }}</div>
          </div>
        </factor-link>
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
import { setting } from "@factor/api"
import { factorLink } from "@factor/ui"
import { DocConfig } from "../util"
export default {
  components: {
    factorLink,
    figureIcon: () => import("./figure-icon.vue"),
  },
  data() {
    return {
      loaded: false,
      selectedGroup: "",
      nav: setting("docsEngine.nav"),
    }
  },
  computed: {
    baseRoute() {
      return setting("docsEngine.baseRoute") ?? "/docs"
    },
    boxes(this: any) {
      return this.nav
        .filter((_: DocConfig) => _.title)
        .map((_: DocConfig) => {
          if (_.items && _.items.length > 0) {
            const { path, doc } = _.items[0]
            _.path = path || `${this.baseRoute}/${doc}`
          }

          return _
        })
    },
  },
  mounted(this: any) {
    setTimeout(() => {
      this.loaded = true
    }, 100)
  },
  metaInfo: {
    title: "Docs",
  },
}
</script>

<style lang="less">
.docs-engine-home {
  padding-bottom: 8rem;
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
    @media (max-width: 900px) {
      padding: 1rem;
    }
  }
  .docs-hero-area {
    .docs-hero-pad {
      position: relative;

      display: grid;
      grid-template-columns: 1fr 8em;
      grid-template-areas: "a b";
      grid-gap: 10rem;
      padding: 6rem 3rem;
      .icon-figure-stage {
        grid-area: b;
        transform: translate(2rem, 3rem);
      }
      .icon-figure {
        margin-bottom: 1.5rem;
        perspective: 800px;
        height: 6rem;
        transform: rotateY(-14deg);
        transform-style: preserve-3d;
        opacity: 1;

        //transition: 3s all cubic-bezier(0.165, 0.84, 0.44, 1);

        .docs-figure-icon {
          transform: rotateZ(20deg) rotateX(15deg);
          opacity: 0.1;
          &:nth-child(2) {
            z-index: 10;
            opacity: 0.4;
            transform: rotateZ(5deg) rotateX(15deg) translateZ(6em);
          }
          &:nth-child(3) {
            z-index: 30;
            opacity: 1;
            transform: rotate(-5deg) rotateX(15deg) translateZ(12em);
          }
          position: absolute;

          border-radius: 6px;
          padding: 1rem;

          width: 6rem;
          height: 6rem;
          background: var(--color-primary);
        }
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-template-areas: "b" "a";
        grid-gap: 2rem;
        padding: 1rem;
        .icon-figure-stage {
          transform: translate(2rem, 2rem) scale(0.7);
        }
      }

      .title-panel {
        grid-area: a;
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
    }
  }
  .docs-groups-area {
    z-index: 10;
    position: relative;

    .docs-groups {
      display: grid;
      grid-template-columns: 1fr 1fr;

      grid-gap: 2rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .doc-group {
      user-select: none;
      color: inherit;
      &:hover {
        box-shadow: 0 0 0 3px var(--color-primary);
      }
      min-width: 0;
      background: #fff;
      font-size: 1em;
      box-shadow: var(--panel-shadow);
      border-radius: 5px;
      padding: 1rem;
      display: grid;
      grid-template-columns: 2rem 1fr;

      grid-gap: 1rem;
      svg {
        width: 2rem;
        height: 2rem;
      }
      .group-title {
        font-size: 1.5em;
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
