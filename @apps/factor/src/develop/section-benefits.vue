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
        <h2 class="reminder-title">Developer Program</h2>
        <div class="sub">Learn, build, and distribute your themes and plugins.</div>
      </div>
      <div class="action">
        <factor-link btn="primary" path="https://go.factor.dev/slack">Join &rarr;</factor-link>
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
          title: "Complete Customization",
          text:
            "Easily add extensions that can be customized with settings by yourself or your customers.",
        },
        {
          icon: "extensions",
          title: "Secret Sauce",
          text: "Having your own extensions can help you get clients and keep them.",
        },
        {
          icon: "support",
          title: "Questions Answered",
          text: "Have a question? Need advice? We'd love to help you with your success.",
        },

        {
          icon: "power",
          title: "Powerful Functionality",
          text:
            "Your extensions will get access to awesome features no one else can touch.",
        },
        {
          icon: "money",
          title: "Make Money",
          text: "Feel free to sell or market your extensions on or off of Factor",
        },
        {
          icon: "satisfaction",
          title: "Innovate",
          text:
            "Spend less time reinventing the wheel and more creating something special.",
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
