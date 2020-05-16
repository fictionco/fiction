<template>
  <figure ref="wrapper" class="stage-container plugins-figure">
    <div class="stage-wrap">
      <div class="stage">
        <div v-for="(plugin, i) in plugins" :key="i" class="plugin-icon" :class="plugin.class">
          <img :src="plugin.image" :alt="plugin.alt" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  data() {
    return {
      plugins: [
        { image: require("./img/icon-docs.svg"), alt: "Docs Icon" },
        { image: require("./img/icon-analytics.svg"), alt: "Analytics Icon" },
        { image: require("./img/icon-forms.svg"), alt: "Forms Icon" },
        { image: require("./img/icon-gallery.svg"), alt: "Gallery Icon" },
        { image: require("./img/icon-feed.svg"), alt: "Feed Icon" },
        { image: require("./img/icon-sitemap.svg"), alt: "Sitemap Icon" },
        { image: require("./img/icon-syntax.svg"), alt: "Syntax Icon" },
        { image: require("./img/icon-themes.svg"), alt: "Themes Icon" },
        { image: require("./img/icon-aws.svg"), alt: "AWS Icon" },
        { image: require("./img/icon-subscriptions.svg"), alt: "Subscriptions Icon" },
        { image: require("./img/icon-jobs.svg"), alt: "Jobs Icon" },
        { image: require("./img/icon-socialize.svg"), alt: "Socialize Icon" },
        { image: require("./img/icon-seo.svg"), alt: "SEO Icon" },
      ],
    }
  },
}
</script>

<style lang="less">
#plugins-feature {
  @media (max-width: 900px) {
    .feature-figure-container {
      height: 500px;
    }
  }
}
figure.plugins-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .stage-wrap {
    perspective: 1000px;
  }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    perspective: 1000px;
    min-width: 500px;
    left: 0;
    top: 0;

    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }

    transform: rotateX(27deg) rotateY(10deg) rotateZ(-7deg) rotate(-2deg) scale(1)
      translateX(0px);
    .plugin-icon {
      position: absolute;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 1.5rem;
      overflow: hidden;
      background: #fff;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08);

      img {
        width: 100%;
      }
      // &.facebook {
      //   background: #0471ff;
      // }
      // &.twitter {
      //   background: #0471ff;
      // }
      &:nth-child(1) {
        top: 5%;
        left: 5%;
      }
      &:nth-child(2) {
        top: 5%;
        left: 38%;
      }
      &:nth-child(3) {
        top: 8%;
        left: 78%;
        transform: scale(0.7);
        opacity: 0.8;
      }
      &:nth-child(4) {
        top: 25%;
        left: 65%;
      }
      &:nth-child(5) {
        top: 75%;
        left: 15%;
      }
      &:nth-child(6) {
        top: 63%;
        left: 30%;
        transform: scale(0.6);
      }
      &:nth-child(7) {
        top: 87%;
        left: 67%;
        transform: scale(1.8);
      }
      &:nth-child(8) {
        top: 50%;
        left: 45%;
      }
      &:nth-child(9) {
        top: 25%;
        left: 5%;
        transform: scale(0.85);
      }
      &:nth-child(10) {
        top: 55%;
        left: 80%;
      }
      &:nth-child(11) {
        top: 35%;
        left: 80%;
      }
      &:nth-child(12) {
        top: 33%;
        left: 30%;
        transform: scale(1.5);
      }
      &:nth-child(13) {
        top: 66%;
        left: 4%;
        transform: scale(1.5);
      }
    }
  }
}
</style>
