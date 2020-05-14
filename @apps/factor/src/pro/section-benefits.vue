<template>
  <div class="factor-pro-benefits">
    <ul class="features-list">
      <li v-for="(feature, i) in features" :key="i" class="feature-block">
        <home-icon :icon="feature.icon" />
        <h3 class="title">{{ feature.title }}</h3>
        <p class="text">{{ feature.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import img from "./img/icon-forum.svg"
export default {
  components: {
    homeIcon: () => import("./icon.vue"),
  },
  data() {
    return {
      img,
      features: [
        {
          icon: "forum",
          title: "Advanced Settings",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          icon: "forum",
          title: "Premium Features",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          icon: "forum",
          title: "Help & Support",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          icon: "forum",
          title: "Advanced Settings",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          icon: "forum",
          title: "Premium Features",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        },
        {
          icon: "forum",
          title: "Help & Support",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
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
}
</style>
