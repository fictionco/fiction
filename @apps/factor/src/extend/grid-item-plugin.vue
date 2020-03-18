<template>
  <factor-link path="#" class="grid-item-plugin">
    <div class="entry-image">
      <img src="./img/screenshot.jpg" alt="Factor Forum" />
      <img src="./img/icon-forum.svg" alt="Factor Forum Icon" class="icon" />
    </div>
    <div class="entry-content">
      <div class="meta">
        <div class="category">Discussion</div>
      </div>
      <h3 class="title">Plugin Forum</h3>
      <p
        class="description"
      >Factor forum is a powerful forum solution for your factor app with essential elements to run an efficient community.</p>
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
.grid-item-plugin {
  display: block;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2);
  transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 2px 3px rgba(50, 50, 93, 0.13),
      0px 2px 5px rgba(50, 50, 93, 0.11);
  }

  .entry-image {
    position: relative;
    max-width: 100%;
    img {
      max-width: 100%;
    }
    .icon {
      position: absolute;
      width: 90px;
      right: 1rem;
      bottom: -1rem;
      background: #fff;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 2px 3px rgba(50, 50, 93, 0.13),
        0px 2px 5px rgba(50, 50, 93, 0.11);
    }
  }

  .entry-content {
    padding: 1rem;
    .meta {
      font-size: 0.9em;
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
    }
    .title {
      color: var(--color-text);
      font-weight: var(--font-weight-bold, 700);
      font-size: 1.5rem;
    }
    .description {
      color: var(--color-text);
      opacity: 0.5;
      // Unofficial line clamp works on all major browsers except IE
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>