<template>
  <div>
    <site-brand />
    <nav>
      <template v-for="(item, index) in footerNav">
        <component :is="item.component()" v-if="item.component" :key="index" />
        <factor-link
          v-else
          :key="index"
          :path="item.path"
          :event="item.event"
          :target="item.target"
        >
          <factor-icon v-if="item.icon" :icon="item.icon" />
          <span v-if="item.name" v-formatted-text="item.name" />
        </factor-link>
      </template>
    </nav>

    <div v-formatted-text="footerLeft" />
    <div v-formatted-text="footerRight" />
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  components: {
    "site-brand": () => import("./el/brand.vue")
  },
  data() {
    return {
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right")
    }
  },
  methods: { setting }
}
</script>