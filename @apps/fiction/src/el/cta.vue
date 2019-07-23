<template>
  <div v-if="!$userId" class="mast">
    <div class="cta">
      <h2>Join {{ $config.setting("memberCount") }}+ Members</h2>
      <app-btn btn="secondary" size="large" action="signinModal">
        Become a Member
        <factor-icon icon="arrow-right" />
      </app-btn>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.cta {
  padding: 2em 0;
  text-align: center;
  position: relative;
  z-index: 100;
  h2 {
    font-size: 2em;
    margin-bottom: 1em;
  }
}
</style>