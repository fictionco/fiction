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
            <span>{{ item.__title || `Item ${i + 1}` }}</span>
            <factor-icon icon="fas fa-grip-horizontal" />
          </div>
        </div>

        <factor-btn class="add-item" @click="addItem()">Add Item</factor-btn>
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
            <factor-icon icon="fas fa-pencil" />
          </span>
        </div>
        <factor-input-wrap
          v-for="(field, i) in settings"
          :key="i"
          :value="getValue(field._id)"
          :input="`factor-input-${field.input}`"
          :label="field.label"
          :description="field.description"
          :class="['engine-input', field.input]"
          :settings="field.settings || []"
          :data-test="`input-${field._id}-${selected + 1}`"
          v-bind="$attrs"
          @input="setValue(field._id, $event)"
        />
        <div>
          <factor-btn size="small" @click="removeItem(selected)">Remove Item</factor-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorBtn, factorIcon, factorInputWrap } from "@factor/ui"
import { randomToken } from "@factor/api/utils"
import { TemplateSetting } from "@factor/templates/types"
import DOM from "jquery"
import Sortable from "sortablejs"

export default {
  components: { factorBtn, factorIcon, factorInputWrap },
  props: {
    value: { type: [Array, Object], default: () => [] },
    settings: { type: Array, default: () => [] },
  },
  data() {
    return {
      selected: 0,
    }
  },
  computed: {
    localValue: {
      get(this: any) {
        return this.ensure(this.value)
      },
      set(this: any, localValue: any) {
        this.$emit("input", localValue)
      },
    },
  },
  mounted() {
    this.sortItems()
  },
  methods: {
    // keys are required for drag and drop
    ensure(v: any[]) {
      return v.map((_) => {
        if (!_.__key) {
          _.__key = randomToken(4)
        }
        return _
      })
    },
    sortItems(this: any) {
      Sortable.create(this.$refs.organizer, {
        filter: ".ignore-sortable",
        ghostClass: "sortable-ghost",
        onUpdate: (e) => {
          const newLocalValue = this.localValue.slice()
          if (e.oldIndex && newLocalValue[e.oldIndex]) {
            const moved = newLocalValue.splice(e.oldIndex, 1)
            newLocalValue.splice(e.newIndex, 0, moved[0])

            this.localValue = newLocalValue
            this.selected = e.newIndex
          }
        },
        onMove: (e) => {
          if (DOM(e.related).hasClass("ignore-sortable")) {
            return false
          } else {
            return true
          }
        },
      })
    },
    addItem(this: any) {
      const newLocalValue = this.localValue.slice()
      const selected = this.value.length
      const item: { [key: string]: any } = {
        __title: `Item ${selected + 1}`,
        __key: randomToken(4),
      }
      this.settings.forEach((field: TemplateSetting) => {
        if ("_default" in field) {
          item[field._id] = field._default
        }
      })
      newLocalValue.push(item)
      this.localValue = newLocalValue
      this.selected = selected
    },
    removeItem(this: any, index: number) {
      const newLocalValue = this.localValue.slice()

      newLocalValue.splice(index, 1)

      this.localValue = newLocalValue

      if (index == this.selected) {
        this.selected = index > 0 ? index - 1 : 0
      }
    },
    getValue(this: any, _id: string) {
      return this.localValue[this.selected]
        ? this.localValue[this.selected][_id]
        : undefined
    },
    setValue(this: any, _id: string, val: any) {
      const newLocalValue = this.localValue.slice()
      newLocalValue[this.selected] = Object.assign({}, newLocalValue[this.selected], {
        [_id]: val,
      })

      this.localValue = newLocalValue
    },
  },
}
</script>
<style lang="less">
.sortable-items {
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 130px 1fr;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  .controls {
    text-align: right;
    .sortable-item {
      box-shadow: 0 0 0 1px var(--color-border);

      font-size: 0.9em;
      margin-bottom: 0.75em;
      padding: 0.3em 0.75em;
      border-radius: 5px;
      text-align: center;
      cursor: move;
      cursor: -webkit-grab;
      cursor: -moz-grab;
      cursor: grab;
      &.active {
        background-color: var(--color-bg-contrast);

        font-weight: var(--font-weight-bold);
      }
      .handle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .factor-icon {
          opacity: 0.2;
        }
      }
    }
    .factor-btn {
      width: 100%;
      display: block;
    }
  }

  .inputs {
    box-shadow: 0 0 0 1px var(--color-border);
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    .title {
      .title-input {
        background: transparent;
        box-shadow: none !important;
        border-radius: 0 !important;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
      }
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
