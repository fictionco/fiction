<template>
  <factor-modal class="added-modal" :vis.sync="vis">
    <h2 v-formatted-text="setting('success.title')" class="added-title" />
    <div v-formatted-text="setting('success.text')" class="added-text" />
    <div class="actions">
      <factor-btn btn="primary" @click="vis = false">Close</factor-btn>
    </div>
  </factor-modal>
</template>
<script lang="ts">
import { factorModal, factorBtn } from "@factor/ui"
import { getSetting } from "."
import Vue from "vue"
export default Vue.extend({
  components: { factorModal, factorBtn },
  props: {
    added: { type: Boolean, default: false },
    listId: { type: String, default: "default" }
  },
  data() {
    return {
      vis: false
    }
  },
  computed: {},
  watch: {
    added: function(v) {
      if (v) this.vis = v
    }
  },
  methods: {
    setting(key) {
      return getSetting({
        key,
        listId: this.listId
      })
    }
  }
})
</script>

<style lang="less">
.added-modal {
  .added-title {
    letter-spacing: -0.02em;
    font-size: 2em;
    font-weight: 700;
  }
  .added-text {
    opacity: 0.7;
  }
  .confirm-icon {
    svg {
      height: 64px;
      width: 64px;
    }
  }
  .actions {
    margin-top: 3rem;
  }
}
</style>
