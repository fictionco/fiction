<template>
  <section class="splash">
    <div class="splash-inner">
      <div class="content">
        <h1 class="page-title">There is an easier way to create professional websites and apps.</h1>
        <h3
          class="page-title-sub"
        >Factor is the JavaScript CMS platform and framework built for web professionals.</h3>

        <div class="actions">
          <factor-link btn="primary" path="/install">Install Factor</factor-link>

          <factor-link btn="link" path="https://go.factor.dev/github" target="_blank">
            <factor-icon icon="fab fa-github" />
            &nbsp;
            {{ version }}
          </factor-link>
        </div>
      </div>

      <div class="figure-container">
        <splash-figure />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorVersion } from "@factor/api/about"
import { factorLink, factorIcon } from "@factor/ui"

export default {
  components: {
    factorLink,
    factorIcon,
    splashFigure: () => import("./figure-splash.vue"),
  },
  computed: {
    version() {
      return `v${factorVersion()}`
    },
  },
}
</script>

<style lang="less">
.splash {
  position: relative;

  .splash-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4em;
    padding: 10rem 3rem 3rem;
    align-items: center;

    @media (min-height: 1000px) {
      padding-top: 170px;
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      text-align: left;
      padding: 3rem 0 0;
    }
    .figure-container {
      min-width: 0;
    }
    .content {
      max-width: 520px;
      justify-self: flex-end;

      h1 {
        z-index: 5;
        position: relative;
      }

      .page-sup {
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      .page-title,
      .page-title-sub {
        letter-spacing: -0.035em;
      }

      .page-title {
        font-size: 3em;
        letter-spacing: -0.035em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .page-title-sub {
        margin-top: 2rem;
        font-size: 1.8em;
        font-weight: 400;
        color: var(--color-text-secondary);
        .highlight {
          color: #5c84a4;
        }
      }

      .actions {
        font-size: 1.3em;
        margin-top: 2rem;
        .factor-btn {
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
      }

      .sub-actions {
        margin-top: 1.5rem;
      }

      @media (max-width: 1200px) {
        max-width: 450px;
        .page-title {
          font-size: 3em;
        }
        .page-title-sub {
          font-size: 1.5em;
        }

        .actions {
          font-size: 1.1em;
        }
      }

      @media (max-width: 900px) {
        padding: 1em 2em;
        justify-self: center;
        max-width: 100%;
        .page-title {
          font-size: 2em;
          line-height: 1.3;
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.4;
        }

        .actions {
          font-size: 1em;
        }
      }
    }
  }
}
</style>
