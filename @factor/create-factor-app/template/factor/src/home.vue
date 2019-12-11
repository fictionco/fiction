<template>
  <div class="page-home">
    <section class="welcome">
      <div class="welcome-inner">
        <h1 v-formatted-text="setting('home.title')" class="title" />
        <div class="subtitle">{{ setting("home.subtitle") }}</div>
        <div class="actions">
          <template v-for="(action, index) in setting('home.actions')">
            <factor-link
              :key="index"
              :path="action.link"
              :target="action.target"
              :btn="action.style"
              size="large"
            >{{ action.text }}</factor-link>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink
  },
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description"),
      image: setting("home.meta.image")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.page-home {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .welcome {
    display: flex;
    align-items: center;
    height: 100vh;

    .welcome-inner {
      max-width: 650px;
      margin: 0 auto;
      text-align: center;
      .icon {
        max-width: 100%;
        margin-bottom: 1em;
      }
      .title {
        font-size: 3.5em;
        line-height: 1.1;
        font-weight: 500;
        margin: 0;
        letter-spacing: -0.03em;
      }
      .subtitle {
        font-size: 2em;
        opacity: 0.7;
      }
      .actions {
        margin-top: 1.5em;
        a {
          margin-left: 1em;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>