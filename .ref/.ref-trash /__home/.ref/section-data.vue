<template>
  <section class="sigma-data">
    <div class="mast split-feature">
      <article class="big-section feature-content">
        <home-icon icon="ssr" />

        <h1 class="section-title">Powered by MongoDB, VueJS and Node.</h1>

        <p class="medium-body-text">
          Quick sidebar access to a full map of the structure of your data stored in
          Stripe (including any
          <a
            class="common-Link"
            href="/docs/charges#storing-information-in-metadata"
          >additional metadata</a>
          you send us) makes it easy to combine all the relevant data needed from across
          Stripe’s products—payments, payouts, customers, subscriptions, refunds, and
          more.
        </p>

        <p class="body-text callout">Preview the full schema available in Stripe Sigma.</p>
      </article>

      <figure class="feature-figure">
        <div class="schema-ui idle-animation idle">
          <div class="list">
            <div class="inner">
              <div class="no-results-message">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue"),
    "image-pattern": () => import("./el-image-pattern")
  },
  methods: {}
}
</script>
<style lang="less">
.sigma-data {
  overflow: hidden;
  position: relative;
  .pattern {
    position: absolute;
    top: -700px;
    bottom: auto;
    left: calc(50% - 1480px);
    @media (max-width: 767px) {
      top: 300px;
      left: calc(50% - 600px);
    }
  }
  .split-feature {
    display: grid;
    grid-template-columns: 1fr 1fr;
    direction: rtl;
    text-align: left;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-content,
    .feature-figure {
      direction: ltr;
    }
    .feature-figure {
      min-height: 500px;
      position: relative;
      z-index: 5;
    }
    .feature-content {
      padding: 180px 0;
      @media (max-width: 767px) {
        padding: 100px 0 20px;
      }
      .callout {
        margin-top: 60px;
        font-size: 15px;
        font-weight: 500;
        color: #525f7f;
        position: relative;
        margin-bottom: 20px;
        @media (max-width: 767px) {
          text-align: center;
        }
        &:after,
        &:before {
          content: "";
          position: absolute;
          background: #87bbfd;
        }
        &:before {
          left: -220px;
          bottom: auto;
          width: 200px;
          height: 2px;
          top: 12px;
          @media (max-width: 767px) {
            top: auto;
            left: calc(50% - 1px);
            width: 2px;
            height: 200px;
            bottom: -215px;
          }
        }
        &:after {
          left: -24px;
          top: 9px;
          bottom: -15px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          @media (max-width: 767px) {
            top: auto;
            left: calc(50% - 4px);
          }
        }
      }
    }
  }

  .schema-ui {
    position: absolute;
    top: 60px;
    left: 0;
    right: 60px;
    bottom: 0;
    margin: 0;
    max-width: 400px;
    font-family: sans-serif;
    background: #fff;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
      0 18px 36px -18px rgba(0, 0, 0, 0.3),
      0 -12px 36px -8px rgba(0, 0, 0, 0.025);

    @media (max-width: 767px) {
      top: 0;
      left: 10px;
      right: 10px;
      margin: 0 auto;
    }
    &:before {
      content: "";
      position: absolute;
      z-index: -1;
      left: -6px;
      top: -6px;
      right: -6px;
      bottom: -6px;
      border-radius: 16px 16px 0 0;
      background: #9cdbff;
      opacity: 0.75;
    }
    .list {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 20px;
      overflow-x: hidden;
      overflow-y: auto;
      user-select: none;
      cursor: default;
    }
  }
}
</style>
