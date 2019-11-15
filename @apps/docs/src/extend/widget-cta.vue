<template>
  <section class="plugins-cta-wrap">
    <div class="content-pad">
      <div class="plugins-cta">
        <div class="text">
          <h2 class="title">Have A Factor Plugin or Theme?</h2>
          <div class="sub-title">Submit Your Extension</div>
        </div>

        <div class="buttons">
          <factor-link
            btn="primary"
            path="/guide/create-plugins"
          >Submit Plugin &rarr;</factor-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
export default { components: { factorLink }, methods: { setting } }
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
    display: flex;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 4rem 0 0;
    padding: 3rem 0;
    @media (max-width: 900px) {
      margin: 0;
      padding: 3rem 0 1rem;
    }
    .text {
      margin-right: 2rem;
      max-width: 500px;
      font-size: 1.5em;
      h2 {
        &.title {
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>
