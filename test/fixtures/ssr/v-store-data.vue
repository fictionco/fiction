<template>
  <h1>{{ text }}</h1>
</template>

<script>
import { storeItem, stored } from "@factor/tools"
export default {
  data() {
    return {}
  },
  computed: {
    text() {
      return stored("text")
    }
  },
  created() {
    storeItem("text", "loaded")
  }
}
</script>
