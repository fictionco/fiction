<script lang="ts" setup>
import { vue } from '@factor/api'

import IconAnalytics from './img/icon-analytics.svg'
import IconAws from './img/icon-aws.svg'
import iDocs from './img/icon-docs.svg'
import iGallery from './img/icon-gallery.svg'
import iSitemap from './img/icon-plugin-sitemap.svg'
import iSocial from './img/icon-socialize.svg'
import iSub from './img/icon-subscriptions.svg'

const plugins = vue.ref([
  { image: IconAnalytics, alt: 'Analytics Icon' },
  { image: iGallery, alt: 'Gallery Icon' },
  { image: iDocs, alt: 'Feed Icon' },
  { image: iSitemap, alt: 'Sitemap Icon' },
  { image: IconAws, alt: 'AWS Icon' },
  { image: iSub, alt: 'Subscriptions Icon' },
  { image: iSocial, alt: 'Socialize Icon' },
])
</script>

<template>
  <figure
    class="figure-plugins absolute right-12 top-12 -mx-12 h-full w-[100%]"
  >
    <div class="stage-wrap">
      <div class="stage">
        <div
          v-for="(plugin, i) in plugins"
          :key="i"
          class="plugin-icon"
        >
          <img :src="plugin.image" :alt="plugin.alt">
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.figure-plugins {
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
    background-image: url("./img/pattern-dot.svg");

    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }

    transform: rotateX(27deg) rotateY(10deg) rotateZ(-7deg) rotate(-2deg)
      scale(1) translateX(0px) translateY(-90px);
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
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.11),
        0px 1px 3px rgba(0, 0, 0, 0.08);

      img {
        width: 100%;
      }
      // &.facebook {
      //   background: #5233ff;
      // }
      // &.twitter {
      //   background: #5233ff;
      // }
      &:nth-child(1) {
        top: -4%;
        left: 5%;
      }
      &:nth-child(2) {
        top: 5%;
        left: 38%;
      }
      &:nth-child(3) {
        display: none;
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
        top: 53%;
        left: 30%;
        transform: scale(0.7);
      }
      &:nth-child(7) {
        top: 87%;
        left: 60%;
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
