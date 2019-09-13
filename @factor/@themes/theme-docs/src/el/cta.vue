<template>
  <section class="mast">
    <div class="cta">
      <div>
        <h3 class="title">{{ $setting.get('cta.title') }}</h3>
        <p class="subtitle">{{ $setting.get('cta.subtitle') }}</p>
      </div>
      <div class="actions">
        <factor-link
          v-for="(action ,i) in $setting.get('cta.actions')"
          :key="i"
          :path="action.path"
          :btn="action.btn"
          size="large"
        >
          {{ action.text }}
          <i v-if="action.btn == 'primary'" class="fa fa-arrow-right" />
        </factor-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {}
</script>

<style lang="less">
.cta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 60px;
  padding: 4em 0;
  @media (max-width: 767px) {
    display: block;
  }
  .title {
    font-weight: 800;
    font-size: 2em;
    letter-spacing: -0.03em;
    line-height: 1.2em;
    margin-bottom: 0.2em;
  }
  .subtitle {
    opacity: 0.5;
    font-size: 1.2em;
    font-weight: 500;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: 767px) {
      display: block;
      margin-top: 1.5em;
    }
  }
}
</style>