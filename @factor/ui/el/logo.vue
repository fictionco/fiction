

<template>
  <logo />
</template>
<script>
/* eslint-disable import/no-unresolved */
export default {
  components: {
    logo: () => import("#/logo.vue")
  }
}
</script>
