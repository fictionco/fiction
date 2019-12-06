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


<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    filter: { type: String, default: "status" },
    tabs: { type: Array, default: () => [] }
  },
  computed: {
    activeItem() {
      return this.$route.query[this.filter] || ""
    }
  },
  methods: {
    setActive(value) {
      value = value ? value : null
      const current = Object.assign({}, this.$route.query)

      delete current[this.filter]
      delete current.page

      const query = value
        ? { ...this.$route.query, [this.filter]: value }
        : current

      this.$router.push({ query })
    }
  }
})
</script>

<style lang="less">
.tabber {
  display: flex;
  justify-content: flex-end;
  > div {
    margin-right: 6px;
  }
  @media (max-width: 900px) {
    justify-content: center;
  }

  // @media (max-width: 550px) {
  //   display: block;
  //   .tabb {
  //     margin: 0.4em 0;
  //   }
  // }

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