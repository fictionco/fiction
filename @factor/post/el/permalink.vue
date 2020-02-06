<template>
  <div class="permalink" @click.stop>
    <div class="linky">
      <factor-link class="linky-link" :path="value ? getPermalink({ postType, permalink }) : ''">
        <span class="root">{{ getPermalink({ postType }) }}</span>
        <span v-if="!toggleValue" class="permalink-value">
          <span class="val">{{ permalink }}</span>
        </span>
      </factor-link>

      <span v-show="toggleValue" class="permalink-input">
        <factor-input-text ref="perm" :value="value || permalink" v-on="listeners" />
      </span>
    </div>
    <div v-if="!toggleValue" class="edit-actions">
      <factor-btn-dashboard size="tiny" class="edit" @click="setToggle()">Edit Permalink</factor-btn-dashboard>
      <factor-btn-dashboard size="tiny" class="edit" @click="updateFromInitial()">Update from Title</factor-btn-dashboard>
    </div>
  </div>
</template>
<script lang="ts">
import { factorInputText, factorBtnDashboard, factorLink } from "@factor/ui"
import { slugify, onEvent, getPermalink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtnDashboard, factorLink, factorInputText },
  props: {
    value: { type: String, default: "" },
    toggle: { type: Boolean, default: false },
    initial: { type: String, default: "" },
    postType: { type: String, default: "" }
  },
  data() {
    return {
      tog: false,
      actual: ""
    }
  },
  computed: {
    locked(this: any): boolean {
      return this.value ? true : false
    },
    permalink(this: any) {
      return this.value ? this.value : this.initialPermalink
    },
    toggleValue(this: any) {
      return this.tog || this.toggle ? true : false
    },
    initialPermalink(this: any) {
      return slugify(this.initial)
    },
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event) => this.emit(event)
      }
    }
  },
  watch: {
    lock: function(this: any, v: string) {
      if (v) {
        this.emit(v)
      }
    }
  },
  mounted() {
    onEvent("save-post", () => {
      if (!this.value) {
        this.emit(this.initialPermalink)
      }
    })
  },
  methods: {
    getPermalink,
    emit(this: any, v: string) {
      this.$emit("input", slugify(v))
    },
    updateFromInitial(this: any) {
      this.emit(this.initialPermalink)
    },
    updateToggle(this: any, v) {
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
    }
  }
})
</script>

<style lang="less">
.permalink {
  font-weight: 500;
  font-size: 0.85em;
  .linky {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",
      monospace;

    .linky-link {
      display: flex;
      line-height: 1.6;
    }
    a {
      color: inherit;
    }
    display: flex;
    align-items: center;
    > span {
      white-space: nowrap;
      flex-grow: 0;
      text-overflow: ellipsis;
      &.permalink-value {
        overflow: hidden;
      }
      &.permalink-input {
        flex-grow: 1;
        input {
          font-family: inherit;
          width: 100%;
          background: #f7f9ff;
          box-shadow: none;
        }
      }
    }
  }
  .root,
  .base {
    opacity: 0.5;
  }
  .sep {
    opacity: 0.5;
  }
  .permalink-input {
    padding-left: 5px;
  }
  .edit-actions {
    margin-top: 1em;
    font-size: 12px;
    .edit {
    }
  }
}
</style>
