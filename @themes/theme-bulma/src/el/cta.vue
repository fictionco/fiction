<template>
  <section class="section is-primary has-text-centered hero call-to-action">
    <div class="container is-narrow">
      <div class="box has-text-white">
        <div class="columns level">
          <div class="column level-item">
            <h1 class="title">{{ setting('site.cta.headline') }}</h1>
          </div>
          <div class="column level-item">
            <p>{{ setting('site.cta.subheadline') }}</p>
          </div>
          <div class="column level-item">
            <factor-link
              class="button is-primary is-outlined is-rounded is-medium has-text-white"
              :path="setting('site.cta.path')"
              target="_blank"
            >
              {{ setting('site.cta.text') }}
              <factor-icon icon="arrow-right" class="ml-2" />
            </factor-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  methods: { setting }
}
</script>
<style lang="less">
.section.call-to-action {
  margin-top: 5.5em;

  .box {
    padding: var(--section-padding);
    margin-top: -9rem;
    background-color: var(--dark);
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px var(--dark);
  }
}
</style>