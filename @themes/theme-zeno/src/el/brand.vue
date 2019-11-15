<template>
  <div>
    <factor-link path="/">
      <img :src="setting(`site.logo`)" :alt="`Zeno`" />
      <!-- <component :is="setting(`site.logo`)" /> -->
    </factor-link>
  </div>
</template>
<script>
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  methods: { setting }
})
</script>
