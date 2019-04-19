<template>
  <li class="member">
    <img :src="getImage(item)" alt="Fiction.com Member">
  </li>
</template>
<script>
export default {
  props: {
    item: { type: Number, default: 0 }
  },
  methods: {
    getImage(num) {
      return require(`./img/user-${num}.jpg`)
    }
  }
}
</script>
<style lang="less">
</style>
