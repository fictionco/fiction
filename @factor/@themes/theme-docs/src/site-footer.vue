<template>
  <div class="content-footer">
    <factor-link path="https://www.fiction.com" class="pin">
      <logo-fiction />
    </factor-link>

    <div class="license">Released under the GPLv3 License</div>
    <div class="copyright">Copyright &copy; 2017-2019 Fiction.com, Inc.</div>
  </div>
</template>
<script>
export default {
  components: {
    "logo-fiction": () => import("./el/logo-fiction")
  },
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.content-footer {
  max-width: 600px;
  text-align: center;
  margin: 0 auto;
  line-height: 1.6em;
  font-size: 0.9em;
  padding: 2em 0 4em;
  .pin {
    margin-bottom: 1.5em;
    display: inline-block;
  }
  .license {
    font-weight: var(--font-weight-bold);
  }
  .copyright {
    opacity: 0.7;
  }
}
</style>
