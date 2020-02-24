<template>
  <section class="splash">
    <div class="splash-inner">
      <div class="content">
        <h1 class="page-title">Build something incredible today</h1>
        <h3 class="page-title-sub">
          <span class="highlight">Factor</span> is the JavaScript CMS for front-end developers.
        </h3>

        <div class="actions">
          <factor-link btn="primary" path="/install">Install Factor &rarr;</factor-link>
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
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    splashFigure: () => import("./figure-splash.vue")
  },
  computed: {
    version() {
      return `v${factorVersion()}`
    }
  }
})
</script>

<style lang="less">
.splash {
  position: relative;

  .splash-inner {
    display: grid;
    grid-template-columns: 40% minmax(40%, 1fr);
    grid-gap: 4em;
    padding: 6rem 3rem 3rem;
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
      max-width: 435px;
      justify-self: flex-end;
      h1 {
        z-index: 5;
        position: relative;
      }

      .page-title,
      .page-title-sub {
        letter-spacing: -0.025em;
      }

      .page-title {
        font-size: 3.3em;
        letter-spacing: -0.025em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;

        @media (max-width: 900px) {
          font-size: 4em;
        }
      }

      .page-title-sub {
        margin-top: 2rem;
        font-size: 2em;
        font-weight: 400;
        color: #8ba8bf;
        .highlight {
          font-weight: 500;
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

      @media (max-width: 900px) {
        padding: 1em 2em;
        justify-self: center;
        max-width: 100%;
        .page-title {
          font-size: 3em;
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.1;
        }

        .actions {
          font-size: 1em;
        }
      }
    }
  }
}
</style>
