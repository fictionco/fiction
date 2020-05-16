<template>
  <div class="factor-benefits">
    <header class="section-header">
      <h1 class="title">Why you'll love using Factor</h1>
      <p class="text">Factor will help you launch websites and applications faster.</p>
    </header>

    <ul class="features-list">
      <li v-for="(feature, i) in features" :key="i" class="feature-block">
        <home-icon :icon="feature.icon" />
        <h3 class="title">{{ feature.title }}</h3>
        <p class="text">{{ feature.text }}</p>
      </li>
    </ul>

    <div class="interstitial-cta">
      <div class="text">
        <h2 class="title">The Famous 10-Minute Challenge</h2>
        <h2 class="title-sub">Create a live website in 10 Minutes</h2>
      </div>

      <div class="buttons">
        <factor-link btn="primary" size="large" path="/install">Start Now &rarr;</factor-link>
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
          icon: "dashboard3",
          title: "Your dashboard",
          text:
            "Wield a powerful post system and dashboard to simplify your backend design and add complete content-management.",
        },
        {
          icon: "themes",
          title: "Themes that work",
          text:
            "Factor is designed for theming. Save time and start with a solid foundation, then customize.",
        },
        {
          icon: "simple2",
          title: "Simple yet powerful",
          text:
            "Factor simplifies your life by helping you use standards and best-practices without having to think about them.",
        },
        {
          icon: "easy2",
          title: "Easy to use",
          text:
            "Nobody likes reading technical docs. Factor is built for people that like to save time, not debug.",
        },
        {
          icon: "optimized2",
          title: "Search optimized",
          text:
            "Build universal apps with VueJS. Get better SEO results with server-rendered apps.",
        },
        {
          icon: "open-source2",
          title: "Free and open-source",
          text:
            "Factor is built on open-source and uses the same license as projects like WordPress and Linux.",
        },
      ],
    }
  },
}
</script>
<style lang="less">
.factor-benefits {
  position: relative;

  @media (max-width: 767px) {
    padding-bottom: 80px;
  }

  .section-header {
    font-size: 1em;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    margin-bottom: 50px;
    letter-spacing: -0.02em;
    .title {
      font-size: 3em;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.025em;

      @media (max-width: 670px) {
        font-size: 2em;
        line-height: 1.2;
      }
    }
    .text {
      margin-top: 20px;
      font-weight: 400;
      font-size: 1.3em;
      line-height: 1.6;
    }
    @media (max-width: 767px) {
      text-align: left;
    }
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
        margin: 10px 0 20px;
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
  .interstitial-cta {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 60px -20px 0;
    padding: 60px 20px 0;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .text h2 {
      &.title {
        color: var(--color-primary);
      }
      font-size: 1.5em;
    }
    .buttons {
      margin: 0 0 0 20px;
      @media (max-width: 767px) {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>
