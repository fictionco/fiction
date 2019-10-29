<template>
  <figure ref="wrapper" class="stage-container plugins-figure">
    <div class="stage-wrap">
      <div class="stage">
        <div class="plugin-icon">
          <img src="./img/icon-notify.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-aws.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-google-analytics.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-user-profiles.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-contact-form.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-notify.svg" />
        </div>
        <div class="plugin-icon">
          <img src="./img/icon-seo.svg" />
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.plugins-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    min-width: 500px;
    left: 0;
    top: 0;

    .plugin-icon {
      position: absolute;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08);
      &:nth-child(1) {
        top: -25%;
        left: 47%;
      }
      &:nth-child(2) {
        top: 50%;
        left: 99%;
      }
      &:nth-child(3) {
        top: 31%;
        left: 44%;
      }
      &:nth-child(4) {
        top: 75%;
        left: 23%;
      }
      &:nth-child(5) {
        top: 67%;
        left: 67%;
      }
      &:nth-child(6) {
        top: 7%;
        left: 75%;
      }
      &:nth-child(7) {
        top: 5%;
        left: 5%;
      }
    }
  }
}
</style>
