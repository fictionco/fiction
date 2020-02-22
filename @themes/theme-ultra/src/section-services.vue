<template>
  <section id="services" class="page-container services-container">
    <h2 v-if="servicesPretitle" v-formatted-text="servicesPretitle" class="pretitle text-gray-100" />
    <h1 v-if="servicesTitle" v-formatted-text="servicesTitle" class="title text-gray-100" />
    <div class="content">
      <div
        v-for="(service, i) in servicesItems"
        :key="i"
        class="services-item text-gray-100 bg-red-600 rounded-lg hover:text-gray-700 hover:bg-white"
      >
        <services-icon
          v-if="service.icon"
          class="icon"
          :icon="service.icon"
          :title="service.title"
        />
        <h4 v-if="service.title">{{ service.title }}</h4>
        <p v-if="service.text">{{ service.text }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
import Vue from "vue"

export default Vue.extend({
  components: {
    "services-icon": () => import("./el/icon-services.vue")
  },
  data() {
    return {
      loading: true,
      servicesPretitle: setting("services.pretitle"),
      servicesTitle: setting("services.title"),
      servicesItems: setting("services.items")
    }
  },
  methods: { setting }
})
</script>

<style lang="less" scope>
.services-container {
  background: var(--color-primary) url(./img/circles-bg.svg) top center no-repeat;

  .pretitle {
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
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
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
