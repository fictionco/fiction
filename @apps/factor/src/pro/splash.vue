<template>
  <section class="splash">
    <div class="splash-inner">
      <div class="content">
        <h3 class="page-sup">Factor Pro / Business Suite</h3>
        <h1 class="page-title">Built for Pros</h1>
        <h3
          class="page-title-sub"
        >Upgrade Factor with professional extensions, features and support.</h3>

        <div class="actions">
          <factor-link btn="primary" path="/plans" size="large">Get Pro &rarr;</factor-link>
        </div>
      </div>

      <div class="figure-container">
        <splash-figure />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"

export default {
  components: {
    factorLink,
    splashFigure: () => import("./figure-splash.vue"),
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
    padding: 4rem 3rem 6rem;
    align-items: center;

    @media (min-height: 1000px) {
      padding-top: 170px;
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      text-align: left;
      padding: 3rem 0 6rem;
    }
    .figure-container {
      min-width: 0;
      display: grid;
      justify-content: center;
    }
    .content {
      max-width: 550px;
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
      }
      .page-title,
      .page-title-sub {
        letter-spacing: -0.035em;
      }

      .page-title {
        font-size: 5em;
        letter-spacing: -0.045em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .page-title-sub {
        margin-top: 2rem;
        font-size: 2.2em;
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
