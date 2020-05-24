<template>
  <factor-input-select
    v-model="select"
    :list="[{name: `Home`, value: '/'}, {name: `Forum`, value: '/forum'}]"
  />
</template>

<script lang="ts">
import { factorInputSelect } from "@factor/ui"
export default {
  components: { factorInputSelect },
  data() {
    return {
      select: this.$route.path,
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
