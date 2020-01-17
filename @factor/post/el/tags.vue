<template>
  <div class="tag-input">
    <div class="the-input">
      <dashboard-input
        v-model="addedText"
        format="simple"
        input="factor-input-text"
        placeholder="Add Tag"
        @keyup.enter="addTag()"
      />
      <factor-btn-dashboard @click="addTag()">
        <factor-icon icon="fas fa-plus" />
      </factor-btn-dashboard>
    </div>
    <div v-if="tags.length > 0" class="the-tags">
      <div v-for="(tag, index) in tags" :key="index" class="tag">
        <span class="tx">{{ tag }}</span>

        <span class="rm" @click="removeTag(index)">
          <factor-icon icon="fas fa-remove" />
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorBtnDashboard, factorIcon } from "@factor/ui"
import { dashboardInput } from "@factor/dashboard"
import { isEqual, slugify } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorBtnDashboard, factorIcon, dashboardInput },
  props: {
    value: { type: Array, default: () => [] }
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
    addTag(this: any) {
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
    display: inline-block;
    padding: 3px 0.5em;
    box-shadow: var(--box-shadow-input);
    border-radius: 5px;
    margin: 0 0.5em 0.5em 0;
    .tx {
      margin-right: 5px;
    }
    .rm {
      font-size: 0.8em;
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
