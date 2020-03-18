<template>
  <factor-link path="#" class="grid-item-theme">
    <div class="entry-images">
      <img src="./img/screenshot-alpha.jpg" alt="Factor Alpha" class="screenshot" />
      <img src="./img/logo-alpha.svg" alt="Factor Alpha Logo" class="logo" />
    </div>
    <div class="entry-content">
      <h3 class="title">Theme Alpha</h3>
      <div class="meta">
        <div class="author">by Factor Inc.</div>
      </div>
    </div>
  </factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: { setting, postLink }
})
</script>

<style lang="less">
.grid-item-theme {
  display: block;
  transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
  &:hover .entry-images .screenshot {
    transform: translateY(-0.5rem);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 2px 3px rgba(50, 50, 93, 0.13),
      0px 2px 5px rgba(50, 50, 93, 0.11);
  }

  .entry-images {
    position: relative;
    max-width: 100%;
    img {
      max-width: 100%;
    }
    .screenshot {
      box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2);
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    }
    .logo {
      position: absolute;
      width: 200px;
      right: 1rem;
      bottom: -1rem;
      background: #fff;
      box-shadow: 0 5px 15px rgba(27, 34, 60, 0.1), 0 15px 35px rgba(27, 34, 60, 0.1),
        0 50px 100px rgba(27, 34, 60, 0.1), 20px -20px 35px rgba(80, 102, 119, 0.15);
      transform: perspective(1040px) rotate(2deg) rotateX(2deg) rotateY(-11deg)
        translateZ(-20px) scale(1);
    }
  }

  .entry-content {
    padding-top: 0.5rem;
    .title {
      color: var(--color-text);
      font-weight: var(--font-weight-bold, 700);
      font-size: 1.5rem;
    }
    .author {
      color: var(--color-text);
      opacity: 0.5;
    }
  }
}
</style>