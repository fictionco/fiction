<template>
  <section class="video-entry">
    <div class="mast">
      <div class="header">
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="video-wrap">
        <div class="video">
          <slot name="left" />
        </div>
        <div class="video-content">
          <slot name="right" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" }
  }
})
</script>

<style lang="less">
.video-entry {
  margin: 0 1.8em;
  padding: 3em 0;
  .mast {
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 0 2em;
    }
  }

  .header {
    .title {
      font-size: 4em;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      max-width: 600px;
      opacity: 0.5;
      font-size: 1.5em;
      font-weight: 500;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }

  .video-wrap {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 2em;
    padding-top: 3em;
    align-items: center;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    .video {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);

      iframe,
      object,
      embed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .video-content {
      font-size: 1.2em;
      font-weight: 500;
      line-height: 1.5;
      p {
        opacity: 0.5;
      }
      .highlight-code-wrap {
        margin: 10px 0;
        padding: 0.5em;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.03);
      }
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }
}
</style>
