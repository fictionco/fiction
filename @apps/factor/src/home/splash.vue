<template>
  <section class="splash">
    <div class="splash-inner">
      <div class="content">
        <h3 class="page-title">Build fast.</h3>
        <h1 class="page-title-sub">
          Factor is the first JavaScript iCMS
          <span ref="ast" class="highlight">
            <span class="asterisk">*</span>
            <div class="drop" :class="dropDirection">
              <strong>iCMS</strong> - An integrated CMS combining a JavaScript framework (Vue, Node) with a CMS-oriented dashboard.
            </div>
          </span>... It's designed
          to help you build web apps and websites faster with
          <factor-link path="/plugins">extensions</factor-link>.
        </h1>

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
    splashFigure: (): Promise<any> => import("./figure-splash.vue"),
  },
  data(): any {
    return {
      dropDirection: "left",
    }
  },
  computed: {
    version(): string {
      return `v${factorVersion()}`
    },
  },
  mounted(): void {
    const el = document.querySelector(".asterisk")

    if (el) {
      setTimeout(() => {
        const { left } = el.getBoundingClientRect()

        if (left < 250) {
          this.dropDirection = "right"
        }
      }, 50)
    }
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

      .highlight {
        position: relative;
        margin-left: -0.2em;

        cursor: pointer;
        .asterisk {
          opacity: 0.8;
        }
        .drop {
          background: #fff;
          position: absolute;
          right: 0;
          &.right {
            right: auto;
            left: 0;
          }
          bottom: 100%;
          color: var(--color-text);
          font-size: 1rem;
          z-index: 100;
          width: 20rem;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0px 0 0 1px rgba(50, 50, 93, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.05),
            0px 7px 14px rgba(50, 50, 93, 0.1);
          transition: opacity 0.2s;
          opacity: 0;
          font-weight: 500;
          line-height: 1.5;
        }
        &:hover {
          .drop {
            display: block;
            opacity: 1;
          }
          .asterisk {
            opacity: 1;
          }
        }
      }

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
        letter-spacing: -0.025em;
      }

      .page-title {
        font-size: 5em;
        letter-spacing: -0.025em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .page-title-sub {
        margin-top: 2rem;
        font-size: 1.8em;
        font-weight: 400;
        color: var(--color-text-secondary);
        a {
          color: inherit;

          position: relative;
          &:before {
            background-image: linear-gradient(90deg, #a6adc9 33%, transparent 0);
            background-position: bottom;
            background-repeat: repeat-x;
            background-size: 3px 1px;
            content: "";
            display: block;
            height: 1px;
            left: 0;
            position: absolute;
            top: 85%;
            width: 100%;
          }
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
          font-size: 3em;
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
