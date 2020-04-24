<template>
  <section v-if="title" class="hero" :style="{ 'background-image': `url(` + bgImage + `)` }">
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
    bgImage: { type: String, default: "" },
    title: { type: String, default: "" },
    buttons: { type: Array, default() {} },
  },
})
</script>

<style lang="less">
.hero {
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-dark);
  background-size: cover;
  background-position: center center;

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    content: " ";
    z-index: 1;
    display: block;
    background-color: rgba(2, 2, 2, 0.43);
  }

  .mast {
    margin: 0 auto;
    max-width: 1140px;
    position: relative;
    z-index: 10;
  }

  .hero-inner {
    padding: 3em 2em;
    color: var(--color-text-light);

    .title {
      font-family: var(--font-family-secondary);
      font-size: 2.2rem;
      margin-bottom: 0.4rem;
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
