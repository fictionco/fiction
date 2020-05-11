<template>
  <factor-link path="/">
    <img v-if="navLogo" :src="navLogo" :alt="logoAlt" class="h-8" :class="logoDisplay" />
    <img
      v-if="navLogoInverse"
      :src="navLogoInverse"
      :alt="logoAlt"
      class="h-8"
      :class="logoInverseDisplay"
    />
  </factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"

export default {
  components: { factorLink },
  data() {
    return {
      navLogo: setting("site.logo"),
      navLogoInverse: setting("site.logoInverse"),
      logoAlt: setting("home.meta.title"),
      logoDisplay: "",
      logoInverseDisplay: "",
    }
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.brandClass()
      },
    },
  },
  mounted() {
    this.brandClass()
  },
  methods: {
    setting,
    brandClass(this: any) {
      if (
        (this.$route.path === "/" || this.$route.path === "/zeno/") &&
        setting("site.logoInverse")
      ) {
        this.logoDisplay = "lg:hidden"
        this.logoInverseDisplay = "hidden lg:block"
      } else {
        this.logoDisplay = "block"
        this.logoInverseDisplay = "hidden"
      }
    },
  },
}
</script>
