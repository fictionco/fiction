<template>
  <section class="big-section sigma-benefits">
    <div class="mast">
      <header class="section-header narrow-container">
        <h1 class="section-title">Designed for Perfectionists with Deadlines</h1>
        <p class="medium-body-text">
          Factor will help you launch apps that impress and astonish your clients and colleagues.
          No more re-inventing the wheel, or rewriting and refactoring where it's unneeded.
        </p>
      </header>

      <ul class="features-list">
        <li class="feature-block">
          <home-icon />
          <h3 class="body-title">Dashboard &amp; Posts</h3>
          <p class="body-text">
            Factor is built with a powerful post system and dashboard that makes it easy to launch dynamic tools.
            No more microsites for forms, blogs, jobs, etc... Factor does all of that and much more...
          </p>
        </li>

        <li class="feature-block">
          <home-icon />
          <h3 class="body-title">Beautiful Themes</h3>
          <p class="body-text">
            Factor is designed from the start for theming.
            Start your app with a beautiful and professional foundation; then customize as much as you need.
          </p>
        </li>

        <li class="feature-block">
          <home-icon />
          <h3 class="body-title">Open Source</h3>
          <p class="body-text">
            Free data from silos and let teammates from finance, support, product
            management, and other teams run reports directly and take action&nbsp;faster.
          </p>
        </li>
      </ul>

      <div class="interstitial-cta">
        <div class="text">
          <h2 class="section-title-highlight">Why wait? Get Started Today</h2>
          <h2 class="section-title">Be up and running with Factor in 3 minutes</h2>
        </div>

        <div class="buttons">
          <app-link btn="primary" size="large">View Quickstart</app-link>
        </div>
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
.sigma-benefits {
  position: relative;
  z-index: 10;
  padding-bottom: 120px;

  @media (max-width: 767px) {
    padding-bottom: 80px;
  }

  &.big-section {
    padding: 180px 0;
    @media (max-width: 767px) {
      padding: 100px 0 20px;
    }
  }
  .narrow-container {
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
  }
  .section-header {
    margin-bottom: 50px;
    p {
      margin-top: 20px;
    }
  }
  .features-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    list-style: none;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-block {
      position: relative;
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
      font-size: 24px;
      line-height: 36px;
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
