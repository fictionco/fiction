<template>
  <section id="homeContainerID" class="home-container page-container">
    <div class="splash-content">
      <h2 class="pretitle">{{ $setting.get('home.pretitle') }}</h2>
      <h1 class="title">{{ $setting.get('home.title') }}</h1>
      <div class="actions">
        <app-link
          v-for="(action ,i) in $setting.get('home.actions')"
          :key="i"
          :path="action.path"
          :btn="action.btn"
          size="large"
        >
          {{ action.text }}
          <factor-icon :icon="action.icon" />
        </app-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  methods: {
    homePaths(path) {
      let ele = document.querySelector(path)
      ele.scrollIntoView()
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(
    at bottom -30% right -30%,
    #732b29 0%,
    #111010 75%,
    #111010 100%
  );
  .splash-content {
    margin: 0 auto;
    max-width: 650px;

    .pretitle {
      color: var(--color-text-gray);
      font-size: 1.4em;
    }
    .title {
      font-size: 3.2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-text);
    }
    .actions {
      margin-top: 2rem;
      .btn-link + .btn-link {
        margin-left: 1rem;
      }
    }
  }
}
</style>
