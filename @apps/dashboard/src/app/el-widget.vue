<template>
  <div class="widget">
    <div class="widget-pad">
      <div class="title">
        <h2>Title</h2>
      </div>
      <div class="widget-content">
        <div class="list">
          <div class="list-item header">
            <div class="text">Label</div>
            <div class="value">Label</div>
          </div>
          <div v-for="(item, i) in 10" :key="i" class="list-item">
            <div class="text">Text</div>
            <div class="value">Value</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  components: {},
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
      display: flex;
      justify-content: space-between;
      padding: 3px;
      &.header {
        color: var(--color-text-secondary);
        font-weight: 600;
      }
    }
  }
}
</style>
