<template>
  <div class="manager-brand">
    <div class="brand-wrap">
      <div class="brand-icon">
        <svg
          width="340"
          height="336"
          viewBox="0 0 340 336"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              class="icon-path"
              d="M292.66 335.466H145.832C136.313 335.466 127.353 331.811 120.633 325.167L8.63634 214.432C0.236593 206.127 -2.33933 193.614 2.25253 182.762C6.8444 171.799 17.4841 164.712 29.4677 164.712H166.552V29.0624C166.552 17.2137 173.719 6.69393 184.695 2.1538C195.559 -2.27559 208.55 0.27131 216.838 8.46568L328.835 119.2C335.555 125.955 339.251 134.703 339.251 144.116V289.289C339.363 314.758 318.419 335.466 292.66 335.466ZM151.992 285.524H288.852V150.206L217.062 79.2252V214.543H80.2022L151.992 285.524Z"
            />
          </g>
        </svg>
      </div>
    </div>
    <div class="app-name">{{ setting('app.name') || "Factor" }}</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api"
export default Vue.extend({
  components: {},
  methods: { setting }
})
</script>
<style lang="less">
.manager-brand {
  display: grid;
  grid-template-columns: 3rem 1fr;
  padding: 1rem;
  align-items: center;

  .app-name {
    padding: 0 0.4rem;
    font-size: 1.1em;
    font-weight: var(--font-weight-bold);
  }
  .brand-wrap {
    justify-self: start;
  }
  .brand-icon {
    box-shadow: var(--box-shadow-input);
    border-radius: 5px;

    padding: 7px 8px 8px 7px;
    svg {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      .icon-path {
        fill: var(--color-text);
      }
    }
  }
}
</style>


