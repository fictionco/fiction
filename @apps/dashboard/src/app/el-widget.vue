<template>
  <div class="widget">
    <div class="widget-pad">
      <div class="title">
        <h2>Title</h2>
      </div>
      <div class="widget-content">
        <div class="list">
          <div class="list-item header">
            <div class="text">Name</div>
            <div class="value">Value</div>
          </div>
          <div v-for="(item, i) in 10" :key="i" class="list-item row">
            <div class="label">
              <div class="proportion" :style="{width: `${100 - i*10}%`}" />
              <factor-link class="text" path="/">Text</factor-link>
            </div>
            <div class="value">Value</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink },
  props: {
    data: { type: String, default: "" },
  },
}
</script>
<style lang="postcss">
.widget {
  box-shadow: var(--item-shadow);
  border-radius: 5px;
  .widget-pad {
    padding: 1rem;
  }
  .title {
    h2 {
      font-weight: 700;
      font-size: 1.2em;
    }
  }
  .list {
    .list-item {
      display: grid;
      grid-template-columns: 1fr 4rem;
      grid-gap: 1rem;
      margin: 0.5rem 0;
      &.header {
        color: var(--color-text-secondary);
        font-weight: 700;
        opacity: 0.5;
        text-transform: uppercase;
        font-size: 0.9em;
      }
      .value {
        text-align: right;
      }
      &.row {
        .label,
        .value {
          position: relative;
        }

        .proportion {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;

          border-radius: 3px;
          background: var(--color-bg-contrast);
        }
        .text {
          display: block;
          z-index: 10;
          position: relative;
          color: inherit;
          padding: 0.2rem 0.5rem;
        }
      }
    }
  }
}
</style>
