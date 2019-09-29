<template>
  <div class="auth-form">
    <el-signin />
  </div>
</template>
<script>
export default {
  components: {
    "el-signin": () => import("./signin")
  },
  metaInfo() {
    return {
      title: "Login / Sign Up",
      description: "Login or register an account."
    }
  }
}
</script>

<style lang="less">
.auth-form {
  max-width: 400px;
  margin: 2em auto;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
