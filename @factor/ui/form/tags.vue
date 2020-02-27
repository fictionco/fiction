<template>
  <div class="tag-input" @keydown.stop>
    <div v-if="list" class="the-input">
      <factor-input-select
        ref="selectField"
        v-model="addedText"
        :list="parsedList"
        :disabled="tagNumber >= max ? true : false"
        @input="addTag()"
      />
    </div>
    <div v-else class="the-input">
      <factor-input-text
        ref="textField"
        v-model="addedText"
        :disabled="tagNumber >= max ? true : false"
        type="text"
        placeholder="Enter tag"
        @keydown.prevent.enter="addTag($event)"
      />
      <factor-btn btn="default" :disabled="tagNumber >= max" @click="addTag()">&rarr;</factor-btn>
    </div>
    <div v-if="tags.length > 0" class="the-tags">
      <div v-for="(tag, index) in tags" :key="index" class="tag">
        <span class="tx">{{ list ? getListItemName(tag) : tag }}</span>

        <span class="rm" @click="removeTag(index)">
          <factor-icon icon="fas fa-times" />
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorBtn, factorIcon, factorInputText, factorInputSelect } from "@factor/ui"
import { isEqual, slugify, toLabel, parseList, ListItem, emitEvent } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorBtn, factorIcon, factorInputText, factorInputSelect },
  props: {
    value: { type: Array, default: () => [] },
    list: { type: Array, default: undefined }, // undefined by default
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 10 }
  },
  data() {
    return {
      tags: [],
      addedText: ""
    }
  },
  computed: {
    tagNumber(this: any) {
      return this.tags.length
    },
    addedSlug(this: any) {
      return slugify(this.addedText)
    },
    parsedList(this: any): ListItem[] {
      return this.list ? parseList(this.list) : []
    }
  },
  mounted(this: any) {
    setTimeout(() => this.setValidity(), 500)
    this.$watch(
      "value",
      function(this: any, v: string[]) {
        if (v && !isEqual(v, this.tags)) {
          this.tags = v
        }
      },
      { immediate: true, deep: true }
    )
  },
  methods: {
    toLabel,
    setValidity(this: any) {
      const wrapper = this.list ? this.$refs.selectField : this.$refs.textField

      const el = wrapper?.$el

      if (!el) return

      if (this.tags.length < this.min) {
        const msg = `Minimum ${this.min} Needed (${this.tags.length} added)`
        el.setCustomValidity(msg)
      } else {
        el.setCustomValidity("")
      }
    },
    getListItemName(this: any, value: string) {
      const item = this.parsedList.find((_: ListItem) => _.value == value)
      return item ? item.name : toLabel(value)
    },
    addTag(this: any) {
      if (this.addedSlug.length < 3) {
        emitEvent("notify", "Tags require at least 3 characters")
        return
      }
      if (this.addedSlug && !this.tags.includes(this.addedSlug)) {
        this.tags.push(this.addedSlug)
        this.setValidity()
        this.$emit("input", this.tags)
      }
      this.addedText = ""
    },
    removeTag(this: any, index: number) {
      this.tags.splice(index, 1)
      this.$emit("input", this.tags)
    }
  }
})
</script>

<style lang="less">
.tag-input {
  .the-tags {
    margin-top: 0.5rem;
  }
  .tag {
    font-size: 0.8rem;
    display: inline-block;
    padding: 3px 0.5em;
    box-shadow: var(--box-shadow-input);
    border-radius: 5px;
    margin: 0 0.5em 0.5em 0;
    .tx {
      margin-right: 5px;
    }
    .rm {
      opacity: 0.3;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
  .the-input {
    display: flex;
    width: 12em;
    input[type="text"] {
      margin-right: 0.5em;
    }
  }
}
</style>
