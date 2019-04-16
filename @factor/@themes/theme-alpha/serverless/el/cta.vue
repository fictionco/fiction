<template>
  <div v-if="!$uid" class="mast">
    <div class="cta">
      <h2>Join {{ $config.setting("memberCount") }}+ Members</h2>
      <factor-link btn="secondary" size="large" action="signinModal">
        Become a Member
        <i class="fa fa-arrow-right" />
      </factor-link>
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