<template>
  <factor-link path="/">
    <img
      :src="setting('site.logo')"
      :alt="setting('home.meta.title')"
      class="h-8"
      :class="logoDisplay"
    />
    <img
      :src="setting('site.logoInverse')"
      :alt="setting('home.meta.title')"
      class="h-8"
      :class="logoInverseDisplay"
    />
  </factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  data() {
    return {
      logoDisplay: "",
      logoInverseDisplay: ""
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.brandClass()
      }
    }
  },
  mounted() {
    this.brandClass()
  },
  methods: {
    setting,
    brandClass(this: any) {
      if (this.$route.path === "/" && setting("site.logoInverse")) {
        this.logoDisplay = "lg:hidden"
        this.logoInverseDisplay = "hidden lg:block"
      } else {
        this.logoDisplay = "block"
        this.logoInverseDisplay = "hidden"
      }
    }
  }
})
</script>
