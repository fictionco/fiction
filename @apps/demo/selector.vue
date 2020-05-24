<template>
  <factor-input-select v-model="select" :list="pluginList" />
</template>

<script lang="ts">
import { factorInputSelect } from "@factor/ui"
export default {
  components: { factorInputSelect },
  data() {
    return {
      select: this.$route.path,
      pluginList: [
        { name: `Home`, value: "/" },
        { name: `Forum`, value: "/forum" },
        { name: `Blog v1`, value: `/blog` },
        { name: `Job Listings`, value: `/jobs` },
        { name: `Subscriptions`, value: `/checkout` },
        { name: `Docs Engine`, value: `/docs` },
      ],
    }
  },
  watch: {
    select: {
      handler: function (v) {
        this.$router.push({ path: v })
      },
    },
  },
}
</script>
