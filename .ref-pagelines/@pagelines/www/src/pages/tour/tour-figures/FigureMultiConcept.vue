<script lang="ts" setup>
import { vue } from '@factor/api'

import j1 from './img/multi-concept-anto-1.jpg'
import j2 from './img/multi-concept-anto-2.jpg'
import j3 from './img/multi-concept-princess-before-1.jpg'
import j4 from './img/multi-concept-princess-before-2.jpg'
import j5 from './img/multi-concept-princess-after-1.png'
import j6 from './img/multi-concept-princess-after-2.png'

const img = vue.ref({
  anto1: { url: j1, alt: 'Anto 1', class: '' },
  anto2: { url: j2, alt: 'Anto 2' },
  princessBefore1: { url: j3, alt: 'Princess Before 1' },
  princessBefore2: { url: j4, alt: 'Princess Before 2' },
  princessAfter1: { url: j5, alt: 'Princess After 1' },
  princessAfter2: { url: j6, alt: 'Princess After 2' },
})
</script>

<template>
  <figure class="figure-multi my-6 lg:my-0 lg:h-56">
    <div class="stage-wrap">
      <div
        class="stage text-theme-200 flex flex-col items-center justify-center lg:absolute lg:flex-row lg:space-x-6"
      >
        <div class="flex space-x-4">
          <div class="overflow-hidden rounded-xl">
            <img :src="img.anto1.url">
          </div>
          <div class="translate-y-3 overflow-hidden rounded-xl">
            <img :src="img.anto2.url">
          </div>
        </div>
        <div><div class="i-heroicons-plus text-3xl lg:text-6xl" /></div>
        <div class="flex space-x-4">
          <div class="-translate-y-3 overflow-hidden rounded-xl">
            <img :src="img.princessBefore1.url">
          </div>
          <div class="overflow-hidden rounded-xl">
            <img :src="img.princessBefore2.url">
          </div>
        </div>
        <div>
          <div class="i-heroicons-arrow-right text-3xl lg:text-6xl" />
        </div>
        <div class="flex space-x-4">
          <div class="overflow-hidden rounded-xl">
            <img :src="img.princessAfter1.url">
          </div>
          <div class="translate-y-3 overflow-hidden rounded-xl">
            <img :src="img.princessAfter2.url">
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.figure-multi {
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

    left: 0;
    top: 0;

    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }

    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)
      translateX(0px) translateY(-0px);
    img {
      width: 100px;
    }
    @media screen and (max-width: 900px) {
      img {
        width: 60px;
      }
    }
  }
}
</style>
