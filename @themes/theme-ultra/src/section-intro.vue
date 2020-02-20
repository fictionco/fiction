<template>
  <section id="intro" class="page-container intro-container">
    <div class="splash-content">
      <h2 v-if="introPretitle" v-formatted-text="introPretitle" class="pretitle" />
      <h1 v-if="introTitle" v-formatted-text="introTitle" class="title" />
      <div class="actions">
        <factor-link
          v-for="(action, i) in introActions"
          :key="i"
          :path="action.path"
          :btn="action.btn"
          size="large"
        >
          {{ action.text }}
          <factor-icon :icon="action.icon" />
        </factor-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api/settings"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorIcon },
  data() {
    return {
      loading: true,
      introPretitle: setting("intro.pretitle"),
      introTitle: setting("intro.title"),
      introActions: setting("intro.actions")
    }
  },
  methods: { setting }
})
</script>
<style lang="less" scoped>
.intro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(
    at bottom -30% right -30%,
    #732b29 0%,
    #111010 75%,
    #111010 100%
  );
  background-color: #351a19;

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
      color: var(--color-text-light);
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
