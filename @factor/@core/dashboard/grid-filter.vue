<template>
  <div class="tabber">
    <div
      v-for="(tab) in filterTabs"
      :key="tab.value"
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
.tabber {
  display: flex;
  > div {
    margin-right: 6px;
  }
  @media (max-width: 767px) {
    padding-bottom: 1em;
    justify-content: center;
    order: -1;
    grid-column-start: 1;
    grid-column-end: 3;
    display: block;
    .tabb {
      margin: 0.4em 0;
    }
  }

  @media (max-width: 550px) {
    display: block;
    .tabb {
      margin: 0.4em 0;
    }
  }

  .tabb {
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