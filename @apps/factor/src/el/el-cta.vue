<template>
  <section class="cta-wrap" :class="offsetCTA">
    <div class="cta">
      <div class="cta-button">
        <slot />
      </div>
      <div class="cta-content">
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  props: {
    offset: { type: Boolean, default: false },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  computed: {
    offsetCTA: function (this: any) {
      return this.offset ? "offset-top" : ""
    },
  },
}
</script>

<style lang="less">
.cta-wrap {
  position: relative;

  &.offset-top .cta {
    margin-top: -50px;
  }

  .cta {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 2em;
    padding: 3em;
    align-items: center;
    border-radius: 4px;
    //background: #0471ff;
    //background-image: url("../img/dot-light.svg");
    background: url("../img/dot-light.svg"),
      linear-gradient(120deg, #0471ff 0, #076bed 50%);

    @media (max-width: 767px) {
      display: flex;
      align-items: flex-start;
      flex-direction: column-reverse;
      .cta-button {
        margin-top: 1em;
      }
    }

    .title {
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
      color: #0c1647;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }

    .subtitle {
      max-width: 600px;
      //opacity: 0.5;
      font-size: 1.4em;
      font-weight: 500;
      color: #fff;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }

    // .cta-content {
    //   font-size: 1.2em;
    //   // @media (max-width: 767px) {
    //   //   font-size: 1.2em;
    //   // }
    // }
  }
}
</style>
