<template>
  <factor-input-select v-model="select" :list="pluginList" />
</template>

<script lang="ts">
import { factorInputSelect } from "@factor/ui"
export default {
  components: { factorInputSelect },
  data(): Record<string, any> {
    return {
      select: this.$route.path,
      pluginList: [
        { name: `Home`, value: "/" },
        { name: `Forum`, value: "/forum" },
        { name: `Standard Blog`, value: `/blog` },
        { name: `Job Listings`, value: `/jobs` },
        { name: `Contact Form`, value: `/contact` },
        // { name: `Subscriptions`, value: `/checkout` },
        // { name: `Docs Engine`, value: `/docs` },
      ],
    }
  },
  watch: {
    select: {
      handler: function (this: any, v) {
        this.$router.push({ path: v })
      },
    },
  },
  mounted() {},
}
</script>
