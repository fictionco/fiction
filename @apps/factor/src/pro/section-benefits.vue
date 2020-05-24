<template>
  <div class="factor-pro-benefits">
    <ul class="features-list">
      <li v-for="(feature, i) in features" :key="i" class="feature-block">
        <home-icon :icon="feature.icon" />
        <h3 class="title">{{ feature.title }}</h3>
        <p class="text">{{ feature.text }}</p>
      </li>
    </ul>
    <div class="reminder">
      <div class="text">
        <h2 class="reminder-title">Get Pro Today</h2>
        <div class="sub">There has never been a better time.</div>
      </div>
      <div class="action">
        <factor-link btn="primary" path="/plans">Get Started &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: {
    factorLink,
    homeIcon: () => import("./icon.vue"),
  },
  data() {
    return {
      features: [
        {
          icon: "settings",
          title: "Pro Settings",
          text:
            "Your existing plugins will get additional functionality like sitemap support and more.",
        },
        {
          icon: "extensions",
          title: "Pro Extensions",
          text:
            "Weild the full power of pro-only plugins built especially for high quality web apps.",
        },
        {
          icon: "support",
          title: "Priority Help & Support",
          text:
            "Have a problem? Need advice? We're here to help. Pro members get priority support.",
        },

        {
          icon: "dashboard",
          title: "Dashboard Enhancements",
          text:
            "With Pro, you'll get access to additional dashboard features designed for production apps.",
        },
        {
          icon: "cancel",
          title: "Cancel Anytime",
          text:
            "If you want to cancel, you can do so at any time. We'll never break production web apps.",
        },
        {
          icon: "satisfaction",
          title: "Satisfaction Guaranteed",
          text: "If you're not happy with the Pro suite, we'll refund your money.",
        },
      ],
    }
  },
}
</script>
<style lang="less">
.factor-pro-benefits {
  position: relative;

  @media (max-width: 767px) {
    padding-bottom: 80px;
  }

  .features-list {
    font-size: 1.1em;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2em;
    list-style: none;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-block {
      position: relative;
      .title {
        font-weight: 700;
        font-size: 1.2em;
        line-height: 1.5em;
      }
      .text {
        font-size: 0.94em;
        line-height: 1.7em;
        opacity: 0.85;
      }
      .icon {
        width: 48px;
        height: 48px;
        margin: 10px 0 20px 0;
        border-radius: 0.5rem;
        box-shadow: 0 2px 3px rgba(50, 50, 93, 0.13), 0 2px 5px rgba(50, 50, 93, 0.11),
          0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
      }
      h3,
      p {
        margin-bottom: 10px;
      }
      p:last-child {
        margin-bottom: 0;
      }
    }
  }
  .reminder {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .reminder-title {
      font-size: 1.4em;
      font-weight: var(--font-weight-bold, 700);
    }
    .sub {
      color: var(--color-text-secondary);
    }
  }
}
</style>
