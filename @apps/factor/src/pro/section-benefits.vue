<template>
  <div class="factor-pro-benefits">
    <ul class="features-list">
      <li class="feature-block">
        <home-icon icon="settings" />
        <h3 class="title">Advanced Settings</h3>
        <p
          class="text"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
      </li>

      <li class="feature-block">
        <home-icon icon="premium" />
        <h3 class="title">Premium Features</h3>
        <p
          class="text"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
      </li>

      <li class="feature-block">
        <home-icon icon="support" />
        <h3 class="title">Help &amp; Support</h3>
        <p
          class="text"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  components: {
    homeIcon: () => import("./icon.vue"),
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
}
</style>
