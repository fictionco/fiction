<template>
  <section class="hero">
    <div class="mast">
      <div v-if="subheadline" class="subheadline" :class="alignment">{{ subheadline }}</div>
      <h1 class="headline" :class="alignment">{{ headline }}</h1>
      <div class="hero-content" :class="alignment">
        <slot name="hero-content" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    align: { type: String, default: "" },
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" }
  },
  computed: {
    alignment(this: any) {
      if (this.align == "center") {
        return "center"
      } else {
        return ""
      }
    }
  }
})
</script>

<style lang="less">
.hero {
  padding-top: 4em;
  padding-bottom: 4em;

  @media (max-width: 767px) {
    padding: 3rem 2rem;
  }

  .mast {
    max-width: 1000px;
    margin: 0 auto;
  }
  .headline,
  .subheadline,
  .hero-content {
    max-width: 42rem;
  }
  .headline {
    font-size: 2.5em;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: -0.03em;
    text-transform: capitalize;

    &.center {
      max-width: 42rem;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .subheadline {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.5;

    @media (max-width: 767px) {
      font-size: 1rem;
    }

    &.center {
      max-width: 42rem;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .hero-content {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    opacity: 0.7;

    &.center {
      max-width: 42rem;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
