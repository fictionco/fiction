<template>
  <div class="tabber">
    <div
      v-for="(tab) in tabs"
      :key="tab.value"
      class="tabb"
      :class="activeItem == tab.value ? 'active': 'not-active'"
    >
      <span class="facet" @click="setActive(tab.value)">{{ tab.name }}</span>
      <span class="count">({{ tab.count || 0 }})</span>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    tabs: { type: Array, default: () => [] }
  },
  computed: {
    activeItem() {
      return this.$route.query.status || "all"
    }
  },
  methods: {
    setActive(value) {
      this.$router.push({ query: { ...this.$route.query, status: value } })
    }
  }
}
</script>

<style lang="less">
.tabber {
  display: flex;
  > div {
    margin: 0 6px;
  }

  .tabb {
    user-select: none;
    .facet {
      color: @color-primary;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    &.active .facet {
      font-weight: 600;
      color: inherit;
    }
    .count {
      opacity: 0.7;
    }
  }
}
</style>