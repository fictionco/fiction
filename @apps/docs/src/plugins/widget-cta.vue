<template>
  <section class="plugins-cta-wrap">
    <div class="content-pad">
      <div class="plugins-cta">
        <div class="text">
          <h2 class="title">{{ setting("plugins.cta.title") }}</h2>
          <h2 class="title-sub">{{ setting("plugins.cta.subtitle") }}</h2>
        </div>

        <div class="buttons">
          <factor-link btn="default" path="/guide/create-plugins">Create Plugin &rarr;</factor-link>
          <factor-link btn="primary" path="/guide/">Submit Plugin &rarr;</factor-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { setting } from "@factor/tools"
export default { methods: { setting } }
</script>
<style lang="less">
.plugins-cta-wrap {
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }
  .plugins-cta {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 4rem 0 0;
    padding: 3rem 0;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      margin: 0;
      padding: 3rem 0 1rem;
    }
    .text {
      max-width: 500px;
      h2 {
        &.title {
          color: var(--color-primary);
        }
        font-size: 1.5em;
      }
    }
    .buttons {
      margin: 0 0 0 20px;
      .btn-link + .btn-link {
        margin-left: 1rem;
      }
      @media (max-width: 900px) {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>