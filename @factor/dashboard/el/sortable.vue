<template>
  <div class="sortable-input">
    <div class="sortable-items">
      <div ref="organizer" class="controls">
        <div
          v-for="(item, i) in localValue"
          :key="item.__key"
          class="sortable-item"
          :class="i == selected ? 'active' : 'inactive'"
          @click="selected = i"
        >
          <div class="handle">
            <span v-if="item.__title">{{ item.__title }}</span>
            <factor-icon icon="arrow-right" />
          </div>
        </div>
        <factor-btn-dashboard btn="primary" @click="addItem()">+</factor-btn-dashboard>
      </div>

      <div class="inputs">
        <div class="title">
          <input
            class="title-input"
            :value="getValue('__title')"
            type="text"
            placeholder="Edit Title"
            :size="getValue('__title') ? getValue('__title').length + 2 : 8"
            @input="setValue('__title', $event.target.value)"
          />
          <span class="edit-me">
            <factor-icon icon="pencil" />
          </span>
        </div>
        <factor-input-wrap
          v-for="(field, i) in inputs"
          :key="i"
          :value="getValue(field._id)"
          :input="`factor-input-${field.input}`"
          :label="field.label"
          :description="field.description"
          :class="['engine-input', field.input]"
          :inputs="field.inputs || []"
          :data-test="`input-${field._id}-${selected + 1}`"
          @input="setValue(field._id, $event)"
        />
        <div>
          <factor-btn-dashboard size="tiny" @click="removeItem(selected)">Remove Item</factor-btn-dashboard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DOM } from "@factor/tools"
import Sortable from "sortablejs"
export default {
  props: {
    value: { type: [Array, Object], default: () => [] },
    inputs: { type: Array, default: () => [] }
  },
  data() {
    return {
      selected: 0
    }
  },
  computed: {
    localValue: {
      get() {
        return this.ensure(this.value)
      },
      set(localValue) {
        this.$emit("input", localValue)
      }
    }
  },
  mounted() {
    this.sortItems()
  },
  methods: {
    // keys are required for drag and drop
    ensure(v) {
      return v.map(_ => {
        if (!_.__key) {
          _.__key = this.$guid()
        }
        return _
      })
    },
    sortItems() {
      Sortable.create(this.$refs.organizer, {
        filter: ".ignore-sortable",
        ghostClass: "sortable-ghost",
        onUpdate: e => {
          const newLocalValue = this.localValue.slice()
          if (newLocalValue[e.oldIndex]) {
            const moved = newLocalValue.splice(e.oldIndex, 1)
            newLocalValue.splice(e.newIndex, 0, moved[0])

            this.localValue = newLocalValue
            this.selected = e.newIndex
          }
        },
        onMove: e => {
          if (DOM(e.related).hasClass("ignore-sortable")) {
            return false
          }
        }
      })
    },
    addItem() {
      const newLocalValue = this.localValue.slice()

      newLocalValue.push({ __title: "", __key: this.$guid() })

      this.localValue = newLocalValue
    },
    removeItem(index) {
      const newLocalValue = this.localValue.slice()

      newLocalValue.splice(index)

      this.localValue = newLocalValue

      if (index == this.selected) {
        this.selected = 0
      }
    },
    getValue(_id) {
      return this.localValue[this.selected] ? this.localValue[this.selected][_id] : null
    },
    setValue(_id, val) {
      const newLocalValue = this.localValue.slice()
      newLocalValue[this.selected] = Object.assign({}, newLocalValue[this.selected], {
        [_id]: val
      })

      this.localValue = newLocalValue
    }
  }
}
</script>
<style lang="less">
.sortable-items {
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 100px 1fr;
  .controls {
    text-align: right;
    .sortable-item {
      //box-shadow: @factor-box-shadow-input;
      font-size: 0.9em;
      margin-bottom: 0.75em;
      padding: 0.3em 0.5em;
      border-radius: 5px;
      text-align: center;
      cursor: move;
      &.active {
        //background: @factor-canvas-bg;
        // color: @factor-color-primary;
        font-weight: var(--font-weight-bold);
      }
    }
    .factor-btn {
      width: 100%;
      display: block;
    }
  }

  .inputs {
    //box-shadow: @factor-box-shadow-input;
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    .title {
      display: flex;
      margin-bottom: 1em;
      align-items: center;
      .edit-me {
        margin-left: 1em;
        opacity: 0.4;
        font-size: 0.8em;
      }
      input {
        width: auto;
        padding: 0.2em;
        padding-left: 0;
        background: none;
        box-shadow: none;
        font-weight: var(--font-weight-bold);
      }
    }
  }
}
</style>
