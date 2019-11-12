<template>
  <div>
    <header-primary />
    <div>
      <router-view />
      <footer-primary />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "header-primary": () => import("./header.vue"),
    "footer-primary": () => import("./footer.vue")
  },
  metaInfo() {
    return {
      title: "No Title",
      titleTemplate: "%s - Factor JS"
    }
  }
}
</script>