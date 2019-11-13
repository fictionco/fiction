<template>
  <div>
    <site-brand />
    <div>
      <template v-for="(item, index) in siteNav">
        <component :is="item.component()" v-if="item.component" :key="index" />
        <factor-link
          v-else
          :key="index"
          :path="item.path"
          :event="item.event"
          :target="item.target"
        >
          <factor-icon v-if="item.icon" :icon="item.icon" />
          <span v-formatted-text="item.name" />
        </factor-link>
      </template>
    </div>
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
      navConfig: setting("site.nav")
    }
  },
  computed: {
    siteNav() {
      return this.navConfig.filter(item => !item.condition || item.condition())
    }
  }
}
</script>