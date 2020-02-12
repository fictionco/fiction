<template>
  <section class="skills">
    <div class="mast">
      <div v-formatted-text="setting('home.boxesTitle')" class="title" />
    </div>

    <div class="mast skills-inner">
      <div v-for="(box, i) in setting('home.boxes')" :key="i" class="box">
        <div v-if="box.icon" class="box-icon">
          <img :src="box.icon" :alt="box.heading" />
        </div>
        <h2 class="box-title">{{ box.heading }}</h2>
        <p class="box-description">{{ box.description }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
//import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  // components: {
  //   factorLink,
  //   homeIcon: () => import("./icon.vue")
  // },
  methods: { setting }
})
</script>
<style lang="less">
// Skills Section
.skills {
  padding: 5em 0;
  .title {
    font-weight: 600;
    font-size: 2.4em;
    letter-spacing: -0.03em;
    margin-bottom: 1em;
    text-align: center;
    @media (max-width: 900px) {
      font-size: 2em;
    }
  }
  .skills-inner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 60px 30px;

    .box {
      padding: 0 3em;
      text-align: center;
      .box-icon {
        margin-bottom: 1em;
        img {
          max-width: 50px;
          display: block;
          margin: 0 auto;
          @media (max-width: 900px) {
            margin: 0;
          }
        }
      }
      .box-title {
        font-size: 1.4em;
        font-weight: 600;
        letter-spacing: -0.03em;
        margin-bottom: 0.5em;
      }
      .box-description {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.6em;
      }
    }
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      .box {
        padding: 0;
        text-align: left;
      }
    }
  }
}
</style>
