<template>
  <div>
    <section>
      <h1>{{ ctaTitle }}</h1>
      <template v-for="(button, index) in ctaButtons">
        <factor-link :key="index" :path="button.link" :class="button.classes">
          {{ button.text }}
          <factor-icon icon="arrow-right" />
        </factor-link>
      </template>
    </section>
  </div>
</template>

<script>
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/tools"
export default {
  components: { factorLink, factorIcon },
  data() {
    return {
      loading: true,
      ctaTitle: setting("site.cta.title"),
      ctaButtons: setting("home.intro.buttons")
    }
  },
  methods: { setting }
}
</script>
