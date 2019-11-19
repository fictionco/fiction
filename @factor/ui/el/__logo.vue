<template>
  <logo />
</template>
<script>
/* eslint-disable import/no-unresolved */
export default {
  components: {
    logo: () => import("__FALLBACK__/logo.vue")
  }
}
</script>
