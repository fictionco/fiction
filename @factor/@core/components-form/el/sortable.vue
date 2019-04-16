<template>
  <div class="sortable-input">
    <div class="sortable-items">
      <div class="controls">
        <div
          v-for="(item, i) in localValue"
          :key="i"
          class="sortable-item"
          :class="i == selected ? 'active' : 'inactive'"
          @click="selected = i"
        >
          <div class="handle">{{ item.__title || "-" }}</div>
        </div>
        <factor-btn btn="primary" @click="localValue.push({})">+</factor-btn>
      </div>

      <div class="inputs">
        <div class="title">
          <input
            :value="getValue('__title')"
            type="text"
            @input="setValue('__title', $event.target.value)"
          >
        </div>
        <factor-input-wrap
          v-for="(field, i) in inputs"
          :key="i"
          :value="getValue(field.key)"
          :input="`factor-input-${field.input}`"
          :label="field.label"
          :description="field.description"
          :class="['engine-input', field.input]"
          :inputs="field.inputs || []"
          :data-test="`input-${field.key}-${selected + 1}`"
          @input="setValue(field.key, $event)"
        />
        <div>
          <factor-btn size="tiny">Remove Item</factor-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
        return this.value
      },
      set(localValue) {
        console.log("emit", localValue)
        this.$emit("input", localValue)
      }
    }
  },
  methods: {
    getValue(key) {
      return this.localValue[this.selected]
        ? this.localValue[this.selected][key]
        : null
    },
    setValue(key, val) {
      const newLocalValue = this.localValue.slice()
      newLocalValue[this.selected] = Object.assign(
        {},
        newLocalValue[this.selected],
        {
          [key]: val
        }
      )

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
      box-shadow: @factor-input-shadow;
      font-size: 0.9em;
      margin-bottom: 0.75em;
      padding: 0.3em 0.5em;
      border-radius: 5px;
      text-align: center;
      cursor: move;
      &.active {
        background: @factor-canvas-bg;
        // color: @factor-color-primary;
        font-weight: 600;
      }
    }
    .factor-btn {
      width: 100%;
      display: block;
    }
  }
  //background: darken(@factor-input-bg, 2%);

  .inputs {
    box-shadow: @factor-input-shadow;
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    .title {
      display: flex;
      margin-bottom: 1em;
      input {
        padding: 0.2em;
        padding-left: 0;
        background: none;
        box-shadow: none;
      }
    }
  }
}
</style>
