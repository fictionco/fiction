<template>
  <div class="stats-wrap">
    <div class="stat-controls">
      <div class="inputs">
        <div class="selector">Last 60 Days</div>
        <div class="selector">
          <span class="value">All Data</span>
          <svg
            class="text-pink-500 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <div class="live">
        <svg class="indicator" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" />
        </svg>

        <span class="text">5 Live Visitors</span>
      </div>
    </div>
    <div class="top-stats">
      <div v-for="(item, i) in 5" :key="i" class="stat-item">
        <div class="label">Unique Visitors</div>
        <div class="info">
          <div class="value">102k</div>
          <div class="change">
            <span class="direction down">&uarr;</span>
            <span class="percent">2%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <darwin-chart />
    </div>
  </div>
</template>
<script lang="ts">
import { factorInputSelect, factorIcon } from "@factor/ui"
export default {
  components: {
    factorInputSelect,
    darwinChart: () => import("../el/chart.vue"),
    factorIcon,
  },
}
</script>
<style lang="postcss">
.stats-wrap {
  --item-shadow: 0 0 15px -5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.25);
  .stat-controls,
  .top-stats {
    display: flex;
    align-items: center;
  }
  .stat-controls {
    justify-content: space-between;
    .live {
      display: flex;
      align-items: center;
      font-weight: 600;

      .indicator {
        margin-right: 0.5rem;
        width: 8px;
        fill: #1aa475;
      }
    }
    .inputs {
      display: flex;
      .selector {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        box-shadow: var(--item-shadow);
        padding: 0.5rem 0.75rem;
        font-size: 0.9em;
        margin-right: 1rem;
        width: 180px;
        svg {
          width: 1rem;
          color: currentColor;
        }
      }
    }
  }
  .top-stats {
    margin: 1rem 0;
    .stat-item {
      border-radius: 5px;
      box-shadow: var(--item-shadow);
      padding: 1rem 1.5rem;
      margin-right: 0.5rem;
      .info {
        display: grid;
        grid-template-columns: 1fr 3em;
        align-items: center;
      }
      .label {
        font-weight: 600;
        font-size: 0.9em;
        color: var(--color-text-secondary);
      }
      .value {
        font-size: 1.1em;
        font-weight: 600;
      }
      .change {
        font-size: 0.85em;
        .direction {
          &.down {
            color: #ea2c26;
          }
        }
      }
    }
  }
  .chart-area {
    margin: 4rem 0 1rem;
  }
}
</style>
