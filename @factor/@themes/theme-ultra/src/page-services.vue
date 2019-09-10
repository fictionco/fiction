<template>
  <div id="servicesContainerID" class="services-container page-container">
    <p class="pretitle">{{ $setting.get('services.pretitle') }}</p>
    <h1 class="title">{{ $setting.get('services.title') }}</h1>
    <div class="services-content-container">
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

<style lang="less" scope>
.services-container {
  background: var(--color-primary);

  .pretitle {
    color: var(--color-text);
    font-size: 1.4em;
    text-align: center;
  }
  .title {
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-align: center;
    color: var(--color-text);
  }
}
.services-quote-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}

.services-quote {
  color: #f7ecea;
  font-size: 1.4vw;
  font-weight: bold;
}
.services-title-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.services-content-container {
  margin: 2rem auto;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
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
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
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
</style>
