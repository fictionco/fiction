<script lang="ts" setup>
import { vue } from '@factor/api'

import j1 from './avatars/jobs-1.webp'
import j2 from './avatars/jobs-2.webp'
import j3 from './avatars/jobs-3.webp'
import j4 from './avatars/jobs-4.webp'
import j5 from './avatars/jobs-5.webp'
import j6 from './avatars/jobs-6.png'
import j7 from './avatars/jobs-7.png'
import j8 from './avatars/jobs-8.png'
import j9 from './avatars/jobs-9.png'
import j10 from './avatars/jobs-10.png'
import j11 from './avatars/jobs-11.png'
import j12 from './avatars/jobs-12.png'
import j13 from './avatars/jobs-13.png'

const plugins = vue.ref([
  { image: j1, alt: 'Docs Icon', class: '' },
  { image: j2, alt: 'Analytics Icon' },
  { image: j3, alt: 'Forms Icon' },
  { image: j4, alt: 'Gallery Icon' },
  { image: j5, alt: 'Feed Icon' },

  { image: j10, alt: 'Subscriptions Icon' },
  { image: j6, alt: 'Sitemap Icon' },
  { image: j7, alt: 'Syntax Icon' },
  { image: j8, alt: 'Themes Icon' },
  { image: j9, alt: 'AWS Icon' },
  { image: j11, alt: 'Jobs Icon' },
  { image: j12, alt: 'Socialize Icon' },
  { image: j13, alt: 'SEO Icon' },
])
</script>

<template>
  <figure
    class="figure-plugins -left-24 h-full w-[110%] lg:absolute"
  >
    <div class="stage-wrap p-6 md:p-0">
      <div class="stage grid grid-cols-7 gap-3 lg:absolute lg:block">
        <div
          v-for="(plugin, i) in plugins"
          :key="i"
          class="plugin-icon shadow-lg lg:absolute"
          :class="plugin.class"
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
    perspective: 700px;
  }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    perspective: 800px;
    min-width: 500px;
    left: 0;
    top: 0;

    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }

    transform: rotateX(17deg) rotateY(15deg) rotateZ(-9deg) rotate(-2deg)
      scale(1) translateX(0px) translateY(-90px);
    .plugin-icon {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 1.5rem;
      overflow: hidden;
      background: #fff;

      img {
        width: 100%;
        image-rendering: optimizeQuality;
      }
      @media screen and (max-width: 900px) {
        border-radius: 0.5rem;
        width: 50px;
        height: 50px;
      }

      // &.facebook {
      //   background: #5233ff;
      // }
      // &.twitter {
      //   background: #5233ff;
      // }
      @media screen and (min-width: 900px) {
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
          left: 70%;
          transform: scale(0.7);
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
}
</style>
