<template>
  <div class="grid-filter">
    <div
      v-for="(tab, i) in filterTabs"
      :key="i"
      class="tabb"
      :class="activeItem == tab.value ? 'active' : 'not-active'"
    >
      <a class="facet" @click.prevent="setActive(tab.value)">{{ tab.name }}</a>
      <span class="count">({{ tab.count || 0 }})</span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    filterId: { type: String, default: "status" },
    filterTabs: { type: Array, default: () => [] }
  },
  computed: {
    activeItem(this: any) {
      return this.$route.query[this.filterId] || ""
    }
  },
  methods: {
    setActive(this: any, value) {
      value = value ? value : null
      const current = Object.assign({}, this.$route.query)

      delete current[this.filterId]
      delete current.page

      const query = value ? { ...this.$route.query, [this.filterId]: value } : current

      this.$router.push({ query })
    }
  }
})
</script>

<style lang="less">
.grid-filter {
  display: flex;
  justify-content: flex-end;

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
