<template>
  <div v-if="!$userId" class="mast">
    <div class="cta">
      <div>
        <h1 class="title">
          <span class="subtitle">We’re here to help.</span>
          Let’s take your app to the next level.
        </h1>
      </div>
      <div class="buttons">
        <factor-link path="/contact" btn="primary" size="large">Contact Sales &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.cta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  padding: 50px 0;
  border-bottom: 2px solid rgba(207, 215, 223, 0.25);
  //padding: 2em 0;
  position: relative;
  z-index: 100;
  .title {
    font-weight: 400;
    font-size: 30px;
    line-height: 45px;
    color: var(--color-primary);
    margin: 0.75em 0;
  }
  .subtitle {
    font-weight: 300;
    color: #32325d;
    display: block;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    .factor-btn + .factor-btn {
      margin-left: 10px;
    }
  }
}
</style>
