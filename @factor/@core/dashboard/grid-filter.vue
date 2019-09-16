<template>
  <div class="grid-filter">
    <div
      v-for="(tab, i) in filterTabs"
      :key="i"
      class="tabb"
      :class="activeItem == tab.value ? 'active': 'not-active'"
    >
      <a class="facet" @click.prevent="setActive(tab.value)">{{ tab.name }}</a>
      <span class="count">({{ tab.count || 0 }})</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    filterId: { type: String, default: "status" },
    filterTabs: { type: Array, default: () => [] }
  },
  computed: {
    activeItem() {
      return this.$route.query[this.filterId] || ""
    }
  },
  methods: {
    setActive(value) {
      value = value ? value : null
      const current = Object.assign({}, this.$route.query)

      delete current[this.filterId]
      delete current.page

      const query = value
        ? { ...this.$route.query, [this.filterId]: value }
        : current

      this.$router.push({ query })
    }
  }
}
</script>

<style lang="less">
.grid-filter {
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  > div {
    margin-right: 0.5rem;
  }
  @media (max-width: 900px) {
    justify-content: center;
  }

  .tabb {
    text-align: center;
    user-select: none;
    .facet {
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