<template>
  <div class="tabber">
    <div
      v-for="(tab) in tabs"
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
    tabs: { type: Array, default: () => [] }
  },
  computed: {
    activeItem() {
      return this.$route.query.status || ""
    }
  },
  methods: {
    setActive(value) {
      value = value ? value : null
      const current = Object.assign({}, this.$route.query)

      delete current.status
      delete current.page

      const query = value ? { ...this.$route.query, status: value } : current

      this.$router.push({ query })
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
  @media (max-width: 767px) {
    padding-bottom: 1em;
    justify-content: center;
    order: -1;
    grid-column-start: 1;
    grid-column-end: 3;
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