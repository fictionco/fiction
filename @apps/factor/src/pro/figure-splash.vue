<template>
  <figure ref="wrapper" class="figure-splash">
    <div class="stage-wrap">
      <div class="stage">
        <div class="screenshot card-settings">
          <img src="./img/card-settings.svg" alt="Settings" />
        </div>
        <div class="screenshot card-support">
          <img src="./img/card-support.svg" alt="Support" />
        </div>
        <div class="screenshot card-extensions">
          <img src="./img/card-extensions.svg" alt="Extensions" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {}
</script>

<style lang="less">
figure.figure-splash {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 1rem auto 4rem;
    width: 450px;
  }

  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 560px;
    position: relative;
    transform: scale(1.1);
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: scale(1) translate(-0, -0px);
    }
    .screenshot {
      top: 35px;
      background: #fff;
      display: inline-block;
      &.card-settings {
        position: absolute;
        top: -30px;
        right: 110px;
        transform: scale(1) perspective(1040px) rotateY(-6deg) rotateX(2deg) rotate(2deg);
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 4px;
      }
      &.card-support {
        position: absolute;
        top: 20px;
        left: 70px;
        z-index: 0;
        transform: scale(1) perspective(1040px) rotateY(-6deg) rotateX(2deg) rotate(2deg)
          translateZ(-40px);
        box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
          0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px;
      }
      &.card-extensions {
        position: absolute;
        top: 270px;
        left: 0;
        transform: translateZ(-8px) scale(1) perspective(1050px);
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 4px;
      }
    }
    perspective: 1000px;
  }
}
</style>
