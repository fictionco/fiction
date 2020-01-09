<template>
  <section class="clients">
    <div v-formatted-text="setting('site.clientsTitle')" class="title" />
    <div class="mast clients-inner">
      <div v-for="(client, i) in setting('site.clients')" :key="i" class="client-wrap">
        <div v-if="client.path" class="client-image">
          <factor-link :path="client.path" target="_blank">
            <img :src="client.icon" :alt="client.text" />
          </factor-link>
        </div>
        <div v-else class="client-image">
          <img :src="client.icon" :alt="client.text" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  data() {
    return {
      loading: true
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.clients {
  background: var(--color-bg-alt, #f3f5fb);
  padding: 3em 0;

  .title {
    font-weight: 600;
    font-size: 2.4em;
    letter-spacing: -0.03em;
    margin-bottom: 1em;
    text-align: center;
    @media (max-width: 767px) {
      font-size: 2em;
    }
  }
  .clients-inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 20px 70px;
    align-items: center;
    @media (max-width: 767px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 2em;
    }
    .client-image {
      padding: 1em 0;
      img {
        max-width: 100%;
        height: 40px;
        display: block;
        margin: 0 auto;
      }
    }
  }
}
</style>
