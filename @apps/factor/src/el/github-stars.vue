<template>
  <div class="github-actions" :class="!loading ? 'loaded': ''">
    <script async defer src="https://buttons.github.io/buttons.js" />
    <a
      class="github-button"
      href="https://github.com/fiction-com/factor"
      data-color-scheme="no-preference: light; light: light; dark: light;"
      data-icon="octicon-star"
      data-size="large"
      data-show-count="true"
      aria-label="Star fiction-com/factor on GitHub"
    >Stars</a>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return { loading: true }
  },
  mounted(this: any) {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }
}
</script>
<style lang="less">
.github-actions {
  display: flex;
   
  opacity: 0;
  transition: all 1s;
  line-height: 1;
  &.loaded {
    opacity: 1;
  }
  > span {
    margin: 0 0.5rem;
  }
  .github-link {
    color: inherit;

    opacity: 0.5;
    margin-left: 1rem;
  }
  a {
    color: transparent;
  }
}
</style>
