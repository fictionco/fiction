<template>
  <div class="mobile-toggle bars" :class="active ? 'active' : ''">
    <span class="bar" />
    <span class="bar" />
    <span class="bar" />
  </div>
</template>
<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {},
  props: {
    active: { type: Boolean, default: false }
  }
})
</script>

<style lang="less">
.mobile-toggle.bars {
  display: flex;
  flex-direction: column;
  width: 1.5rem;
  height: 2rem;
  justify-content: center;
  position: relative;
  align-self: center;
  opacity: 0.6;
  .bar {
    background: currentColor;
    height: 0.25rem;
    width: 1.25rem;
    border-radius: 4px;
    left: 0%;
    position: absolute;
    transition: all 0.2s;

    &:first-child {
      transform: translateY(-8px);
    }
    &:last-child {
      transform: translateY(8px);
    }
  }

  &.active {
    z-index: 10;

    width: 2rem;
    .bar {
      transform: translateY(0);
      margin: 0;
      width: 1.75rem;
    }
    .bar:first-child {
      transform: translateX(-0.25rem) rotate(45deg);
    }
    .bar:nth-child(2) {
      transform: translateX(-0.25rem) rotate(-45deg);
    }
    .bar:last-child {
      display: none;
    }
  }
}
</style>
