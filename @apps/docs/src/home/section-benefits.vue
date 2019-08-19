<template>
  <section class="factor-benefits">
    <header class="section-header">
      <h1 class="section-title">Perfect for Perfectionists with Deadlines</h1>
      <p class="medium-body-text">
        Factor will help you launch apps that impress and astonish your clients and colleagues.
        No more re-inventing the wheel, or rewriting and refactoring where it's unneeded.
      </p>
    </header>

    <ul class="features-list">
      <li class="feature-block">
        <home-icon />
        <h3 class="title">Dashboard &amp; Posts</h3>
        <p class="text">
          Weild a powerful post system and dashboard to make advanced apps simple.
          No more cobbling things together, Factor does it all and more...
        </p>
      </li>

      <li class="feature-block">
        <home-icon />
        <h3 class="title">Beautiful Themes, Rad Plugins</h3>
        <p class="text">
          Factor is designed from the start for theming.
          Start your app with a beautiful and professional foundation; then customize as much as you need.
        </p>
      </li>

      <li class="feature-block">
        <home-icon />
        <h3 class="title">GPL Licensed</h3>
        <p
          class="text"
        >Factor uses the same time-proven open source license as projects like WordPress and Linux. Factor is powered by the freedom of its users.</p>
      </li>
    </ul>

    <div class="interstitial-cta">
      <div class="text">
        <h2 class="title">Build Your App</h2>
        <h2 class="title-sub">Be up and running with Factor in 3 minutes</h2>
      </div>

      <div class="buttons">
        <app-link btn="primary" size="large">View Quickstart &rarr;</app-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue")
  },
  methods: {}
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
    p {
      margin-top: 20px;
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
        font-weight: 500;
        font-size: 1.35em;
        line-height: 1.5em;
      }
      .text {
        font-size: 1.05em;
        opacity: 0.85;
      }
      .icon {
        width: 48px;
        height: 48px;
        margin-left: -1px;
        margin: 10px 0 20px -3px;
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
