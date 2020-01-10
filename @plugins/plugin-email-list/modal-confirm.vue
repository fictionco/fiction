<template>
  <factor-modal class="added-modal" :vis.sync="vis">
    <h2 v-formatted-text="setting('success.title')" class="added-title" />
    <div v-formatted-text="setting('success.text')" class="added-text" />
    <div v-if="link" class="actions">
      <factor-link btn="primary" :path="link.path" @click="vis = false">
        <span v-formatted-text="link.text" />
      </factor-link>
    </div>
  </factor-modal>
</template>
<script lang="ts">
import { factorModal, factorLink } from "@factor/ui"
import Vue from "vue"
 
import { getSetting } from "."
export default Vue.extend({
  components: { factorModal, factorLink },
  props: {
    added: { type: String, default: "" },
    listId: { type: String, default: "default" }
  },
  data() {
    return {
      vis: false
    }
  },
  computed: {
    link(this: any): { path?: string; close?: boolean; text?: string } | false {
      const linkSetting = this.setting("success.link")
      return linkSetting && this.added ? linkSetting(this.added) : false
    }
  },
  watch: {
    added: function(this: any, v: string) {
      if (v) {
        this.vis = true
      }
    }
  },
  methods: {
    setting(this: any, key: string) {
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
