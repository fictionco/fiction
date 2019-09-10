<template>
  <div class="grid-controls">
    <slot/>
  </div>
</template>

<style lang="less">
.grid-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
}
</style>