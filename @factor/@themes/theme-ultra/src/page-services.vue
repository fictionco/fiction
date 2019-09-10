<template>
  <div
    id="servicesContainerID"
    class="services-container page-container"
    :class="[mobile ? 'services-container-mobile' : '', (mobile && orientationH) ? 'services-container-horizontal' : '']"
  >
    <div class="services-quote-container">
      <p
        class="services-quote"
        :class="[mobile ? 'services-quote-mobile' : '', (mobile && orientationH) ? 'services-quote-horizontal' : '']"
      >{{ $setting.get('services.quote') }}</p>
    </div>
    <div
      class="services-title-container"
      :class="[mobile ? 'services-title-container-mobile' : '', (mobile && orientationH) ? 'services-title-container-horizontal' : '']"
    >
      <h1
        class="services-title"
        :class="[mobile ? 'services-title-mobile' : '', (mobile && orientationH) ? 'services-title-horizontal' : '']"
      >{{ $setting.get('services.title') }}</h1>
    </div>
    <div
      class="services-content-container"
      :class="[mobile ? 'services-content-container-mobile' : '', (mobile && orientationH) ? 'services-content-container-horizontal' : '']"
    >
      <div
        v-for="(service, i) in $setting.get('services.contentBlocks')"
        :key="i"
        class="services-item"
      >
        <img class="icon" :src="service.icon" :alt="service.alt" >
        <h4>{{ service.title }}</h4>
        <p>{{ service.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mobile", "orientationH"]
}
</script>

<style lang="less" scope>
.services-container {
  background: #fa5855;
}
// .services-container-mobile {
//   grid-template-rows: 60px 110px 60px;
// }
// .services-container-horizontal {
//   grid-template-rows: 60px 60px 60px;
// }
.services-quote-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-quote {
  color: #f7ecea;
  font-size: 1.4vw;
  font-weight: bold;
}
.services-quote-mobile {
  font-size: 18px;
  margin-bottom: 0;
}
.services-title-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-title-container-mobile {
  margin: 1.2vw 0 0 7.2vw;
}
.services-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.services-title-mobile {
  font-size: 18px;
  margin-top: 0;
}
.services-content-container {
  margin: 2rem auto;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  // grid-template-areas:
  //   "div div"
  //   "div div";
}
.services-content-container-mobile {
  margin-left: 32px;
}
.services-content-container-horizontal {
  margin-left: 80px;
}
.services-item {
  height: 100%;
  padding: 2rem;
  background: #da524f;
  border-radius: 12px;
  color: #f7f7f7;
  transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover {
    background: #f7f7f7;
    color: #111010;
    transform: translateY(-2px);
    box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.4),
      0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .icon {
    width: 3rem;
    margin-bottom: 1rem;
  }
  h4 {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.4rem;
  }
}
// .services-content-mobile {
//   width: 159px;
//   height: 240px;
//   padding: 5px;
// }
// .services-content-horizontal {
//   width: 300px;
//   height: 109px;
// }
.services-content-title-mobile {
  margin: 0;
  font-size: 13px;
}
// .services-content-text-mobile {
//   margin: 5px 0 0 0;
//   font-size: 11px;
// }
// .services-content-text-horizontal {
//   font-size: 9.5px;
// }
</style>
