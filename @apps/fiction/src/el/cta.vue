<template>
  <div v-if="!isLoggedIn()" class="mast">
    <div class="cta">
      <div>
        <h1 class="title">
          <span class="subtitle">Ready to get started?</span>
          Get started in the Dashboard or contact sales.
        </h1>
      </div>
      <div class="buttons">
        <factor-btn action="signinModal" class="common-Button common-Button--default">Get Started</factor-btn>
        <factor-btn path="/contact" class="common-Button">Contact Sales</factor-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { isLoggedIn } from "@factor/user"
export default { methods: { isLoggedIn } }
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
    color: #32325d;
    margin: 0.75em 0;
  }
  .subtitle {
    font-weight: 300;
    color: #6772e5;
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
