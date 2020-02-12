<template>
  <section class="hero">
    <div class="mast">
      <div class="hero-inner">
        <div>
          <h1 class="pretitle">{{ pretitle }}</h1>
          <h2 class="title">{{ title }}</h2>
          <slot name="hero-content" />
        </div>
        <div v-if="image != ''">
          <div :style="{ 'background-image': `url(` + image + `)` }" class="hero-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    pretitle: { type: String, default: "" },
    title: { type: String, default: "" },
    image: { type: String, default: "" }
  }
})
</script>

<style lang="less">
// Hero
.hero {
  position: relative;
  //overflow: hidden;
  background: var(--color-bg-alt, #f3f5fb);

  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  // &:before {
  //   content: "";
  //   display: block;
  //   position: absolute;
  //   width: 80%;
  //   height: 100%;
  //   top: 0;
  //   right: auto;
  //   bottom: 0;
  //   //border-bottom-right-radius: 40px;
  //   background-color: var(--color-bg-alt, #f3f5fb);
  //   @media (max-width: 1024px) {
  //     width: 100%;
  //   }
  // }

  .hero-inner {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 60px;
    align-items: center;
    padding: 3em 0;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
    @media (max-width: 900px) {
      padding: 4em 0;
    }
    .pretitle {
      font-size: 1.1em;
      text-transform: uppercase;
      color: var(--color-primary);
    }
    .title {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      margin: 0.3em 0;
      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .content {
      font-size: 1.2em;
      line-height: 1.6em;
      opacity: 0.5;
    }
    .hero-image {
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      height: 450px;
      max-width: 300px;
      box-shadow: 20px 60px 120px 0 rgba(0, 0, 0, 0.33);
      border-radius: 20px;
      @media (max-width: 900px) {
        margin: 0 auto;
        max-width: 100%;
      }
    }
  }
}
</style>
