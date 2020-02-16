<template>
  <div class="tag-input">
    <div v-if="list" class="the-input">
      <factor-input-select v-model="addedText" :list="parsedList" @input="addTag()" />
    </div>
    <div v-else class="the-input">
      <factor-input-text
        v-model="addedText"
        type="text"
        placeholder="Enter tag"
        @keyup.enter="addTag()"
      />
      <factor-btn btn="default" @click="addTag()">Add</factor-btn>
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
    list: { type: Array, default: undefined } // undefined by default
  },
  data() {
    return {
      tags: [],
      addedText: ""
    }
  },
  computed: {
    addedSlug(this: any) {
      return slugify(this.addedText)
    },
    parsedList(this: any): ListItem[] {
      return this.list ? parseList(this.list) : []
    }
  },
  mounted(this: any) {
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
