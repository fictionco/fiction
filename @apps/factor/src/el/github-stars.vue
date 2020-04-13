<template>
  <transition name="fade">
    <div v-if="!loading" class="github-actions">
      <script async defer src="https://buttons.github.io/buttons.js" />
      <a
        class="github-button"
        href="https://github.com/fiction-com/factor"
        data-color-scheme="no-preference: light; light: light; dark: light;"
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star fiction-com/factor on GitHub"
        >{{ text }}</a
      >
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    text: { type: String, default: "Follow Project" },
  },

  data() {
    return { loading: true }
  },
  mounted(this: any) {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
})
</script>
<style lang="less">
.github-actions {
  display: flex;

  opacity: 1;
  transition: all 1s;
  line-height: 1;
  // &.loaded {
  //   opacity: 1;
  // }

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
