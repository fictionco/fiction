<template>
  <iframe class="frame" :src="currentUrl" />
</template>

<script lang="ts">
import Vue from "vue"
import { currentUrl } from "@factor/api/url"

export default Vue.extend({
  components: {},
  computed: {
    currentUrl
  }
})
</script>

<style lang="less">
.frame {
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
