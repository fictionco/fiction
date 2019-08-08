<template>
  <div class="content-footer">
    <div class="logo">
      <factor-link path="https://www.fiction.com" class="pin">
        <component :is="$setting.get(`footer.logo`)" />
      </factor-link>
    </div>
    <div class="legal">
      <div v-formatted-text="$setting.get('footer.headline')" class="license" />
      <div v-formatted-text="$setting.get('footer.legal')" class="copyright" />
    </div>
  </div>
</template>
<script>
export default {}
</script>

<style lang="less">
.content-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.6em;
  font-size: 0.9em;
  padding: 2em 0 4em;
  margin-top: 4em;
  .logo {
    margin-right: 3em;
  }
  .pin {
    display: inline-block;
  }
  .license {
    font-weight: var(--font-weight-bold);
  }
  .copyright {
    opacity: 0.7;
  }
  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
