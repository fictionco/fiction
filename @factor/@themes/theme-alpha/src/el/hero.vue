<template>
  <section class="hero">
    <div class="mast">
      <div class="hero-inner">
        <div>
          <h1 class="title">{{ headline }}</h1>
          <h2 class="heading">{{ subheadline }}</h2>
          <slot name="hero-content" />
        </div>
        <div v-if="image != ''">
          <div :style="{ 'background-image': `url(` + image + `)` }" class="hero-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" },
    image: { type: String, default: "" }
  }
}
</script>

<style lang="less">
// Hero
.hero {
  position: relative;
  overflow: hidden;

  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 70%;
    height: 100%;
    top: 0;
    right: auto;
    bottom: 0;
    background-color: var(--color-bg-alt, #f3f5fb);
    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .hero-inner {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 60px;
    align-items: center;
    padding: 5em 0;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-size: 1.1em;
      text-transform: uppercase;
    }
    .heading {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      margin: 0.3em 0;
      @media (max-width: 767px) {
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
      border-top-left-radius: 40px;
      @media (max-width: 767px) {
        margin: 0 auto;
        max-width: 100%;
      }
    }
  }
}
</style>
