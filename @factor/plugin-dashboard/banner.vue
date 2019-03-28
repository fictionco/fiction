<template>
  <div class="dashboard-banner">
    <div v-formatted-text="title" class="space title" />
    <div v-formatted-text="subTitle" class="space sub-title" />
    <div v-if="$slots.default" class="space x2 banner-content">
      <slot />
    </div>
  </div>
</template>


<script>
export default {
  props: {
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" }
  }
}
</script>

<style lang="less">
.dashboard-banner {
  font-weight: 500;
  padding: 1.5em;
  line-height: 16px;
  .title {
    font-size: 1.65em;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .sub-title {
    font-size: 1.2em;
    opacity: 0.5;
  }
  .space {
    margin-top: 1rem;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>