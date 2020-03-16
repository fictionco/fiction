<template>
  <div class="factor-img" :class="theme">
    <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25.6208 31.1539H12.7635C11.9292 31.1539 11.1435 30.8136 10.5534 30.1929L0.756994 19.9144C0.0164131 19.1393 -0.202585 17.9801 0.196961 16.9665C0.598179 15.9511 1.53268 15.2935 2.58086 15.2935H14.5856V2.70014C14.5856 1.60408 15.2108 0.623765 16.1772 0.202878C17.1283 -0.212748 18.2618 0.024001 18.989 0.786862L28.7904 11.0688C29.3805 11.6913 29.7048 12.5138 29.7048 13.3872V26.8713C29.7032 29.2335 27.8726 31.1539 25.6208 31.1539ZM13.3017 26.5206H25.2881V13.9466L19.0024 7.35269V19.9267H7.01598L13.3017 26.5206Z"
        class="thelogo"
      />
    </svg>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    theme: { type: String, default: "" }
  }
})
</script>


<style lang="less">
.factor-img {
  &.factor-img-footer {
    opacity: 0.1;
  }
  svg {
    display: block;
  }
  .thelogo {
    fill: #99adc0;
  }
  &:hover {
    .thelogo {
      fill: var(--color-primary);
    }
  }
}
</style>
