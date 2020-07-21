<template >
  <div class="signin-view">
    <div class="sidebar">
      <div class="sidebar-pad">
        <div class="logo-area">
          <logo class="logo" />
        </div>
        <div class="points">
          <div v-for="(point, i) in points" :key="i" class="point">
            <div class="icon">
              <factor-icon :icon="point.icon ? point.icon : `fas fa-check`" />
            </div>
            <div class="text">
              <h2 class="head">{{ point.head }}</h2>
              <cite v-if="point.cite" class="cite">&mdash; {{ point.cite }}</cite>
              <p v-else class="sub">{{ point.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <signin />
      <div class="footer">
        <factor-link path="https://www.fiction.com">&copy; Fiction</factor-link>
        <factor-link path="/privacy">Privacy &amp; Terms</factor-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { toLabel } from "@factor/api"
import { factorIcon, factorLink } from "@factor/ui"
export default {
  components: {
    signin: () => import("./signin.vue"),
    logo: () => import("../el/logo.vue"),
    factorIcon,
    factorLink,
  },
  computed: {
    mode(): string {
      const mode =
        this.$route.name == "login" || this.$route.query.new == "no"
          ? "login"
          : "register"
      return mode
    },
    points() {
      const benefits = [
        {
          head: "Sign up free",
          text: "Enter your email to create an account",
        },
        {
          head: "Understand you visitors",
          text: "Maximize your website's performance using Darwin's tools",
        },
        {
          head: "Get more conversions",
          text: "Optimize your website to create more leads and make more money",
        },
      ]

      const quotes = [
        {
          head:
            "One who dares to waste one hour of time has not discovered the value of life.",
          cite: "Charles Darwin",
        },
        {
          head: "I love fools' experiments. I am always making them.",
          cite: "Charles Darwin",
        },
        {
          head:
            "In the long history of humankind (and animal kind, too) those who learned to collaborate and improvise most effectively have prevailed.",
          cite: "Charles Darwin",
        },
        {
          head:
            "To kill an error is as good a service as, and sometimes even better than, the establishing of a new truth or fact.",
          cite: "Charles Darwin",
        },
        {
          head:
            "It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is the most adaptable to change.",
          cite: "Charles Darwin",
        },
      ]

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

      return this.mode == "register"
        ? benefits
        : [{ icon: "fas fa-quote-left", ...randomQuote }]
    },
  },
  metaInfo(this: any) {
    return { title: toLabel(this.mode) }
  },
}
</script>
<style lang="postcss">
.signin-view {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 1.618fr;
  height: 100vh;
  .sidebar {
    background-color: var(--color-primary-dark);
    color: #fff;
    .sidebar-pad {
      padding: 2rem;
    }
    .logo-area {
      text-align: center;
      .logo {
        width: 150px;
      }
    }

    .points {
      margin: 2rem 0;
      max-width: 380px;
      .point {
        margin: 1.5rem 0;
        display: grid;
        grid-template-columns: 2rem 1fr;
        .icon {
          color: var(--color-primary);
        }
        .head {
          font-weight: 700;
        }
        .sub {
          opacity: 0.7;
        }
        .cite {
          text-align: right;
          display: block;
          opacity: 0.7;
          margin-top: 0.5rem;
          font-weight: 600;
        }
      }
    }
  }
  .sidebar,
  .main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 1rem;
      font-size: 11px;
      text-align: center;
      a {
        opacity: 0.7;
        color: inherit;
        margin: 0 0.5rem;
      }
    }
  }
}
</style>
