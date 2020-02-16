<template>
  <div v-if="aboutClients" :id="aboutClientsid" class="clients">
    <template v-for="(item, i) in aboutClientsItems">
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
      loading: true,
      aboutClients: setting("about.clients"),
      aboutClientsid: setting("about.clients.id"),
      aboutClientsItems: setting("about.clients.items")
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
