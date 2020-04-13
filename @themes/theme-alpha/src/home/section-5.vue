<template>
  <section v-if="section5" :id="section5.id" class="section5">
    <div class="mast">
      <el-clients />
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-clients": () => import("../el/clients.vue"),
  },
  data() {
    return {
      loading: true,
      section5: setting("about.clients"),
      section5id: setting("about.clients.id"),
    }
  },
  methods: {
    setting,
  },
})
</script>
<style lang="less">
/**
  * Clients section
  */
.section5 {
  padding: 0 0 8em;
  background: var(--color-bg-alt);

  .pretitle {
    color: var(--color-primary);
  }
}
</style>
