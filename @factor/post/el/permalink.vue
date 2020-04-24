<template>
  <div class="permalink" @click.stop>
    <factor-link class="p-item linky" :path="permalink">{{ permalink }}</factor-link>
    <factor-input-text
      v-show="toggleValue"
      ref="perm"
      class="p-item permalink-input"
      :value="value"
      v-on="listeners"
    />
    <div class="p-item edit-actions">
      <factor-btn-dashboard
        v-if="!toggleValue"
        size="small"
        btn="default"
        class="edit"
        @click="setToggle()"
      >Edit</factor-btn-dashboard>
    </div>
  </div>
</template>
<script lang="ts">
import { factorInputText, factorBtnDashboard, factorLink } from "@factor/ui"
import { slugify, onEvent, stored, getPostTypeConfig } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtnDashboard, factorLink, factorInputText },
  props: {
    value: { type: String, default: "" },
    toggle: { type: Boolean, default: false },
    postId: { type: String, default: "" },
    postType: { type: String, default: "" },
  },
  data() {
    return {
      tog: false,
      actual: "",
    }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) ?? {}
    },
    postTypeConfig() {
      return getPostTypeConfig(this.postType)
    },
    locked(this: any): boolean {
      return this.value ? true : false
    },
    permalink(this: any) {
      return this.postTypeConfig.permalink(this.post)
    },
    toggleValue(this: any) {
      return this.tog || this.toggle ? true : false
    },

    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event) => this.emit(event),
      }
    },
  },
  watch: {
    lock: function (this: any, v: string) {
      if (v) {
        this.emit(v)
      }
    },
  },
  mounted(this: any) {
    onEvent("save-post", () => {
      if (!this.value && this.post.title) {
        this.emit(this.post.title)
      }
    })
  },
  methods: {
    emit(this: any, v: string) {
      this.$emit("input", slugify(v))
    },

    updateToggle(this: any, v: boolean) {
      this.$emit("update:toggle", v)

      this.tog = v
    },
    setToggle(this: any) {
      if (!document) {
        return
      }
      this.clickHandler = () => {
        if (this.toggleValue) {
          this.updateToggle(false)
          document.removeEventListener("click", this.clickHandler, false)
        }
      }

      if (!this.toggleValue) {
        this.updateToggle(true)

        this.$refs.perm.$el.focus()
        document.addEventListener("click", this.clickHandler, false)
      } else {
        this.updateToggle(false)
        document.removeEventListener("click", this.clickHandler, false)
      }
    },
  },
})
</script>

<style lang="less">
.permalink {
  .p-item {
    display: block;
    margin: 1rem 0;
  }
}
</style>
