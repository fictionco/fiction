<template>
  <li class="member">
    <img :src="getImage(item)" alt="Fiction.com Member" />
  </li>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    item: { type: Number, default: 0 },
  },
  methods: {
    getImage(num) {
      return require(`./img/user-${num}.jpg`)
    },
  },
})
</script>
<style lang="less"></style>
