<template>
  <div v-if="setting('about.clients')" :id="setting('about.clients.id')" class="clients">
    <template v-for="(item, i) in setting('about.clients.items')">
      <factor-link v-if="item.link" :key="i" :path="item.link" :target="item.target">
        <img v-if="item.image" :src="item.image" :alt="item.alt" />
      </factor-link>
      <div v-else-if="item.image" :key="i">
        <img :src="item.image" :alt="item.alt" />
      </div>
    </template>
  </div>
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
