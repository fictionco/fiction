<template>
  <div class="nav-engine">
    <div v-for="(group, groupIndex) in nav" :key="groupIndex" class="list-group">
      <div v-if="group.title" class="list-group-title">{{ group.title }}</div>

      <factor-link
        v-for="(item, iIndex) in group.items"
        :key="iIndex"
        :path="item.path"
        :query="item.query"
        :event="item.event"
        :data-test="`${testPrefix}-${item.key}`"
      >{{ item.name }}</factor-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    nav: { type: Array, default: () => [] },
    testPrefix: { type: String, default: "nav-item" }
  },
  data() {
    return {}
  }
}
</script>