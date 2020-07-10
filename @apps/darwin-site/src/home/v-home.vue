<template>
  <div class="view-home">
    <section class="splash">
      <div class="splash-inner">
        <div class="content">
          <div class="super">Currently in Stealth Mode</div>
          <h1 class="page-title">Understand Your Visitors and Convert More Traffic</h1>
          <h2
            class="page-title-sub"
          >Session replays, heatmaps and behavioral analytics to you understand precisely how your visitors feel about your website.</h2>

          <factor-email-list list-id="darwinAlpha" />
        </div>

        <div class="figure-container">
          <splash-figure />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorEmailList } from "@factor/plugin-email-list"

export default {
  components: {
    factorEmailList,
    splashFigure: (): Promise<any> => import("./figure-splash.vue"),
  },
  metaInfo() {
    return {
      title: "Analyze, measure, and improve your product.",
      description:
        "Powerful but simple analytics to help you convert, engage, and retain more users.",
    }
  },
}
</script>

<style lang="less">
.view-home {
  .splash {
    position: relative;
    input {
      background: #fff;
    }
    .splash-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 12em;
      padding: 10rem 3rem 2rem;
      align-items: center;

      @media (min-height: 1000px) {
        padding-top: 170px;
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        text-align: left;
        padding: 6rem 2rem 3rem;
        grid-gap: 2rem;
      }

      .figure-container {
        min-width: 0;
      }
      .content {
        max-width: 520px;
        justify-self: flex-end;

        .super {
          text-transform: uppercase;
          color: var(--color-primary);
          letter-spacing: 0.02em;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .page-title,
        .page-title-sub {
          letter-spacing: -0.025em;
        }

        .page-title {
          font-size: 3em;
          letter-spacing: -0.025em;
          line-height: 1.1;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .page-title-sub {
          margin-top: 1rem;
          font-size: 1.5em;
          font-weight: 500;

          color: var(--color-text-secondary);
        }

        .email-list-form {
          margin: 2rem auto 0;
        }

        @media (max-width: 900px) {
          padding: 1em 0;
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
          .email-list-form {
            font-size: 1.3rem;
          }
        }
      }
    }
  }
}
</style>
