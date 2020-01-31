<template>
  <figure ref="wrapper" class="stage-container plugins-figure">
    <div class="stage-wrap">
      <div class="stage">
        <div class="plugin-icon">
          <img src="./img/icon-blog.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-notify.svg" />
        </div>
        <div class="plugin-icon twitter">
          <img src="./img/icon-twitter.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-gtm.svg" />
        </div>
        <div class="plugin-icon facebook">
          <img src="./img/icon-facebook.svg" />
        </div>

        <div class="plugin-icon">
          <img src="./img/icon-user-profiles.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-google-analytics.svg" />
        </div>

        <div class="plugin-icon">
          <img src="./img/icon-syntax.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-contact-form.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-aws.svg" alt="AWS icon" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-jobs.svg" alt="Jobs icon" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-seo.svg" alt="SEO icon" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-sitemap.svg" alt="sitemap icon" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>

<style lang="less">
#plugins-feature {
  background: linear-gradient(0deg, #edf6ff, rgba(235, 239, 243, 0));
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
    perspective: 1000px;
    transform: rotateX(10deg) rotateY(0deg) rotate(-1deg) scale(1) translateX(-15px);
    .plugin-icon {
      position: absolute;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08);
      &.facebook {
        background: #1776f2;
      }
      &.twitter {
        background: #1ea1f2;
      }
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
