<template>
  <svg
    class="elem-hover-arrow relative mt-0.5 stroke-2 stroke-current"
    viewBox="0 0 10 10"
    aria-hidden="true"
    :class="[
      direction == 'left' ? 'arrow-left mr-2' : 'ml-2',
      size == 'large' ? 'w-3 h-3' : 'w-2.5 h-2.5',
    ]"
  >
    <g fill-rule="evenodd">
      <path
        class="a transition-transform"
        d="M1 1l4 4-4 4"
        :class="[
          direction == 'left' ? 'origin-center transform rotate-180' : '',
        ]"
      />
      <path
        class="b transition-opacity opacity-0"
        d="M0 5h7"
        :class="[direction == 'left' ? 'transform translate-x-1' : '']"
      />
    </g>
  </svg>
</template>
<script lang="ts">
export default {
  props: {
    size: { type: String, default: "" },
    direction: { type: String, default: "" },
  },
  methods: {},
}
</script>
<style lang="less">
a {
  .elem-hover-arrow {
    fill: none;
  }
  &:hover .elem-hover-arrow {
    .a {
      transform: translateX(3px);
    }
    .b {
      opacity: 1;
    }
    &.arrow-left {
      .a {
        transform-origin: center;
        transform: translateX(-0.25rem) rotate(-180deg);
      }
    }
  }
}
</style>
