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
  }
  // methods: {
  //   homePaths(path) {
  //     let action = document.querySelector(path)
  //     action.scrollIntoView()
  //   }
  // }
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
      font-size: 1.4rem;
      @media (max-width: 900px) {
        font-size: 1.2rem;
      }
    }
    .title {
      font-size: 3.2rem;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-text);
      @media (max-width: 900px) {
        font-size: 2.2rem;
      }
    }
    .actions {
      margin-top: 2rem;

      .btn-link + .btn-link {
        margin-left: 1rem;
      }

      @media (max-width: 900px) {
        .btn-link {
          display: grid;
        }
        .btn-link + .btn-link {
          margin-top: 1rem;
          margin-left: 0;
        }
      }
    }
  }
}
</style>
