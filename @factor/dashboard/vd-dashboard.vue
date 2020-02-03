<template>
  <dashboard-page :loading="loading">
    <dashboard-pane class="dashboard-splash">
      <div class="splash-head">
        <div class="content">
          <h1 v-formatted-text="title" class="title" />
          <div v-formatted-text="subTitle" class="space sub-title" />
          <div v-if="$slots.default" class="space x2 splash-content">
            <slot />
          </div>
        </div>
        <div class="splash-media">
          <figure>
            <div class="reverse">
              <span />
            </div>
          </figure>
        </div>
      </div>
      <div v-if="features && features.length > 0" class="splash-features">
        <div v-for="(f, i) in features" :key="i" class="feature">
          <h2 class="sp title">{{ f.title }}</h2>
          <slot name="content" />
          <div class="sp description">{{ f.description }}</div>
          <div class="sp sp2 action">
            <factor-link btn="primary" :path="f.path">
              <span v-formatted-text="f.btn" />
            </factor-link>
          </div>
        </div>
      </div>
    </dashboard-pane>
  </dashboard-page>
</template>
<script  lang="ts">
import { dashboardPage, dashboardPane } from "@factor/dashboard"
import { factorLink } from "@factor/ui"
import { userInitialized } from "@factor/user"
import Vue from "vue"
export default Vue.extend({
  components: {
    dashboardPage,
    dashboardPane,
    factorLink
  },
  data() {
    return {
      loading: true,
      title: "Admin",
      subTitle: "Tools to manage your app",
      features: [
        {
          title: "Themes and Plugins",
          description: "Browse and download Factor extensions for your app.",
          content: "something",
          btn: "Go to Factor.dev &rarr;",
          path: "https://factor.dev"
        },
        {
          title: "Slack Channel",
          description: "Need some help getting things rolling? Join the Slack channel",
          btn: "Join &rarr;",
          path: "https://go.factor.dev/slack"
        },
        {
          title: "Requests or Issues",
          description:
            "Find a bug or have a feature request? Don't be shy, submit an issue.",
          btn: "Github Repo &rarr;",
          path: "https://go.factor.dev/issues"
        }
      ]
    }
  },
  async mounted() {
    await userInitialized()
    this.loading = false
  },
  metaInfo() {
    return {
      title: "Admin",
      description: "Fiction.com dashboard overview.",
      priority: 30
    }
  }
})
</script>

<style lang="less">
.dashboard-pane.dashboard-splash {
  overflow: hidden;
  font-weight: 500;

  line-height: 16px;
  > .cont {
    padding: 0;
  }

  .list-unstyled {
    list-style: none;
    padding: 0;
    svg path,
    i {
      color: #506677;
      fill: #506677;
    }
  }

  .splash-head {
    position: relative;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 1.2em;
      padding: 6em 2rem;
      line-height: 1.4;
      width: 50%;
      // min-height: 250px;
      // height: 30vw;
      // max-height: 50vh;
      @media (max-width: 767px) {
        width: 100%;
        padding: 3em 2rem;
      }
    }
    .title {
      line-height: 1;
      font-size: 1.65em;
      font-weight: var(--font-weight-bold);
    }
    .sub-title {
      font-size: 1.2em;
      opacity: 0.5;
    }
    .space {
      margin-top: 1rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .splash-features {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2em;
    padding: 2rem;
    border-top: 1px solid rgba(62, 62, 62, 0.1);
    line-height: 1.4;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .icon {
      width: 40px;
    }
    .title {
      font-weight: var(--font-weight-bold);
      font-size: 1.2em;
    }
    .description {
      opacity: 0.6;
    }
    .feature > .sp {
      margin-top: 0.5em;
      &.sp2 {
        margin-top: 1em;
      }
      &:first-child {
        margin-top: 0;
      }
    }
  }

  .splash-media {
    figure {
      height: 100%;
      position: absolute;
      overflow: hidden;
      z-index: 2;
      right: -50px;
      top: 0;
      left: 55%;
      transform: skewX(15deg);
      .reverse {
        position: absolute;
        left: -100%;
        width: 200%;
        height: 200%;
        transform: skewX(-15deg);
        background-image: url("./resource/dot.svg");
      }
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;

        background-size: cover;
        background-position: center center;
        height: 100%;
        right: 30px;
        top: 0;
        bottom: 0;
        left: -110px;
        transform: skewX(-10deg);
        svg {
          max-width: 150px;
        }
      }
    }
    @media (max-width: 767px) {
      figure {
        display: none;
        position: relative;
        height: 200px;
        background: #525f7f;
        overflow: hidden;
        right: 0;
        top: 0;
        left: 0;
        -webkit-transform: skewX(0);
        transform: skewX(0);

        span {
          position: relative;
          height: 200px;
          left: 0;
          transform: none;
        }
      }
    }
  }
}
</style>
