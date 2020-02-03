<template>
  <section class="splash">
    <div class="splash-inner">
      <div class="content">
        <h1 class="page-title">Build your website right.</h1>
        <h3 class="page-title-sub">The Javascript CMS for front-end developers.</h3>

        <div class="actions">
          <factor-link btn="primary" path="/install">Get Started &rarr;</factor-link>
          <factor-link btn="default" path="/signin?newAccount=1">Create Account</factor-link>
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
    splashFigure: () => import("./figure-splash.vue")
  }
}
</script>

<style lang="less">
.splash {
  position: relative;

  .splash-inner {
    display: grid;
    grid-template-columns: 40% minmax(40%, 1fr); //minmax(40%, 1fr) minmax(1fr, 60%);
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
        font-size: 4em;
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
      }

      .actions {
        font-size: 1.4em;
        margin-top: 2rem;
        .factor-btn {
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
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
