<template>
  <section class="pricing-wrap">
    <div class="mast">
      <h2 class="section-title section-title">Ready to throw down?</h2>
      <div class="pricing-section">
        <home-icon />
        <div class="feature-list core">
          <h3 class="feature-title body-title">The Factor 3-Minute Quickstart</h3>
          <p class="body-text">We’ll guide you through what’s needed to set up your startup.</p>
          <h4 class="feature-lead body-title">Includes</h4>
          <ul class="body-text">
            <li>
              <span>Server-Side Rendered</span>
            </li>
            <li>
              <span>Dashboard and Post Management</span>
            </li>
            <li>
              <span>Open-Source MEVN Stack Framework</span>
            </li>
            <li>
              <span>Tool to issue stock to founders&nbsp;</span>
            </li>
            <li>
              <span>First year of registered agent fees&nbsp;</span>
            </li>
          </ul>
        </div>
        <div class="price">
          <app-link path="/guide">View Docs &rarr;</app-link>
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
.pricing-wrap {
  position: relative;
  margin: 180px 0 90px;
  z-index: 1;

  @media (max-width: 767px) {
    margin: 90px 0;
  }

  .pricing-section,
  .business-section {
    display: grid;
    grid-template-columns: 48px 70% auto;
    margin-top: 64px;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    > .icon {
      max-width: 48px;
      margin-bottom: 16px;
    }

    > .feature-list {
      padding: 0 220px 0 64px;

      @media (max-width: 767px) {
        padding: 0;
      }

      &.core {
        padding-right: 64px;

        @media (max-width: 767px) {
          padding-right: 0;
        }

        ul {
          list-style: none;
          padding-left: 0;
          li {
            display: flex;
            &:before {
              content: "";
              display: inline-block;
              background-image: url(./img/checkmark.svg);
              background-size: 100%;
              width: 20px;
              height: 20px;
              margin: 4px 16px 0 0;
            }
          }
        }
      }

      .feature-lead {
        color: #6b7c93;
        margin-top: 24px;
      }
      ul {
        list-style-type: disc;
        margin: 0;
        padding-left: 20px;

        li {
          color: #aab7c4;
          padding: 8px 0;
          span {
            color: #525f7f;
          }
        }
      }
    }

    .price {
      border-left: 1px solid #e6ebf1;
      padding: 0 0 0 32px;
      font-size: 1.4em;
      @media (max-width: 767px) {
        border-bottom: 1px solid #e6ebf1;
        border-left: 0;
        padding: 16px 0 30px;
      }
    }
  }
}
</style>
