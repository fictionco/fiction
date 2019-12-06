<template>
  <section id="services" class="page-container services-container">
    <h2 class="pretitle">{{ setting('services.pretitle') }}</h2>
    <h1 class="title">{{ setting('services.title') }}</h1>
    <div class="content">
      <div v-for="(service, i) in setting('services.items')" :key="i" class="services-item">
        <services-icon class="icon" :icon="service.icon" :title="service.title" />
        <h4>{{ service.title }}</h4>
        <p>{{ service.text }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/tools/settings"
import Vue from "vue"

export default Vue.extend({
  components: {
    "services-icon": () => import("./el/icon-services.vue")
  },
  methods: { setting }
})
</script>

<style lang="less" scope>
.services-container {
  background: var(--color-primary) url(./img/circles-bg.svg) top center no-repeat;

  .pretitle {
    color: var(--color-text-light);
    font-size: 1.4em;
    text-align: center;
    @media (max-width: 900px) {
      font-size: 1.2rem;
    }
  }
  .title {
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-align: center;
    color: var(--color-text-light);
    max-width: 800px;
    margin: 0 auto 1rem;
    @media (max-width: 900px) {
      font-size: 2.2rem;
    }
  }
  .content {
    margin: 2rem auto;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
  .services-item {
    height: 100%;
    padding: 2rem;
    background-color: var(--color-primary-dark);
    border-radius: var(--border-radius);
    color: var(--color-text-light);
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      background: var(--color-text-light);
      color: var(--color-text);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
      svg path {
        fill: var(--color-primary);
      }
    }
    .icon {
      width: 3rem;
      margin-bottom: 1rem;
    }
    h4 {
      font-size: 1.4rem;
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.03em;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 1.2rem;
    }
  }
}
</style>
