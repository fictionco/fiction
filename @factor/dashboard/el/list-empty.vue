<template>
  <div class="list-empty">
    <factor-loading-ring v-if="loading && list.length == 0" />
    <div v-if="!loading && list.length == 0" class="no-posts">
      <div class="no-posts-text">Nothing Found</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorLoadingRing } from "@factor/ui"
export default Vue.extend({
  components: { factorLoadingRing },
  props: {
    list: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      selectAllSelected: false,
      actionValue: ""
    }
  },
  computed: {},
  methods: {}
})
</script>

<style lang="less">
.list-empty {
  .loading-ring-wrap {
    height: 60vh;
  }
  .no-posts {
    font-weight: 600;
    font-size: 1.4em;
    letter-spacing: -0.03em;
    height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.3;
  }
}
</style>
