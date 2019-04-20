<template>
  <div class="cta">
    <div class="cta-inner">
      <h2>For work inquiries, collaboration or feedback</h2>
      <factor-link btn="default" size="large" path="/contact">
        Get in Touch
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
  padding: 4em 0;
  text-align: center;
  position: relative;
  //z-index: 100;
  background: @color-primary;
  color: @color-white;
  .cta-inner {
    max-width: 650px;
    margin: 0 auto;
  }
  h2 {
    font-size: 2.5em;
    font-weight: 600;
    margin-bottom: 1em;
  }
  .factor-btn {
    letter-spacing: -0.03em;
  }
}
</style>