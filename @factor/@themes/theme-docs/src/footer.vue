<template>
  <div class="content-footer">
    <factor-link path="https://www.fiction.com" class="pin">
      <component :is="$setting.get(`footer.logo`)" />
    </factor-link>

    <div v-formatted-text="$setting.get('footer.headline')" class="license" />
    <div v-formatted-text="$setting.get('footer.legal')" class="copyright" />
  </div>
</template>
<script>
export default {}
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
