<template>
  <section id="intro" class="page-container intro">
    <div class="intro-inner">
      <h2
        v-if="introPretitle"
        v-formatted-text="introPretitle"
        class="pretitle text-gray-600"
      />
      <h1 v-if="introTitle" v-formatted-text="introTitle" class="title text-gray-100" />
      <div v-if="introButtons" class="buttons">
        <template v-for="(button, index) in introButtons">
          <factor-link
            v-if="button.link"
            :key="index"
            v-formatted-text="button.text"
            :path="button.link"
            :btn="button.btn"
            :class="button.classes"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  data() {
    return {
      loading: true,
      introPretitle: setting("intro.pretitle"),
      introTitle: setting("intro.title"),
      introButtons: setting("intro.buttons"),
      introActions: setting("intro.actions"),
    }
  },
  methods: { setting },
})
</script>
<style lang="less" scoped>
.intro {
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

  .intro-inner {
    margin: 0 auto;
    max-width: 650px;

    .pretitle {
      font-size: 1.4rem;
    }
    .title {
      font-size: 3.2rem;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    .buttons {
      z-index: 2;
      margin-top: 2em;
      .btn + .btn {
        margin-left: 1em;
        i {
          padding-left: 1rem;
        }
      }
    }

    @media (max-width: 900px) {
      .pretitle {
        font-size: 1.2rem;
      }
      .title {
        font-size: 2.2rem;
      }
      .buttons {
        .btn {
          display: block;
          width: fit-content;
          margin-bottom: 1rem;
        }
        .btn + .btn {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
