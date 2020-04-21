<template>
  <section v-if="title" class="hero">
    <div class="mast">
      <div class="hero-inner">
        <h1 v-formatted-text="title" class="title" />
        <slot name="hero-content" />
        <div v-if="buttons" class="buttons">
          <template v-for="(button, index) in buttons">
            <factor-link
              v-if="button.link"
              :key="index"
              :path="button.link"
              :btn="button.btn"
              :class="button.classes"
              :target="button.target"
            >
              <span v-formatted-text="button.text" />
            </factor-link>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
  },
  props: {
    title: { type: String, default: "" },
    buttons: { type: Array, default() {} },
  },
})
</script>

<style lang="less">
.hero {
  border-top: 1px solid var(--color-borders);
  border-bottom: 1px solid var(--color-borders);
  background: var(--color-bg-alt);

  .mast {
    margin: 0 auto;
    max-width: 1140px;
  }

  .hero-inner {
    padding: 3em 2em;

    .title {
      font-size: 3rem;
      font-weight: 700;
    }
    .content {
      font-size: 1.2em;
    }
    .buttons {
      margin-top: 2em;
      .btn-link + .btn-link {
        margin-left: 1em;
        i {
          padding-left: 1rem;
        }
      }
    }
  }
}
</style>
