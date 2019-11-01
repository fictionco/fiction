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
<script>
import { slugify, onEvent, getPermalink } from "@factor/tools"

export default {
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
    locked() {
      return this.value ? true : false
    },
    permalink() {
      return this.value ? this.value : this.initialPermalink
    },
    toggleValue() {
      return this.tog || this.toggle ? true : false
    },
    initialPermalink() {
      return slugify(this.initial)
    },
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.emit(event)
      }
    }
  },
  watch: {
    lock: function(v) {
      if (v) {
        this.emit(v)
      }
    }
  },
  mounted() {
    onEvent("lockPermalink", () => {
      if (!this.value) {
        this.emit(this.initialPermalink)
      }
    })
  },
  methods: {
    getPermalink,
    emit(v) {
      this.$emit("input", slugify(v))
    },
    updateFromInitial() {
      this.emit(this.initialPermalink)
    },
    updateToggle(v) {
      this.$emit("update:toggle", v)

      this.tog = v
    },
    setToggle() {
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
}
</script>


<style lang="less">
.permalink {
  font-weight: 500;
  font-size: 0.85em;
  .linky {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",
      monospace;
    font-size: 12px;
    .linky-link {
      display: flex;
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
      // &:hover {
      //   color: #0496ff;
      //   cursor: pointer;
      //   opacity: 1;
      // }
      // background-color: #f7f9ff;
      // box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.1);
      // border-radius: 4px;
      // padding: 1px 3px;
      //  margin-right: 1em;
    }
  }
}
</style>
