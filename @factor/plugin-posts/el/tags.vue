<template>
  <div class="tag-input">
    <div v-if="tags.length > 0" class="the-tags">
      <div v-for="(tag, index) in tags" :key="index" class="tag">
        <span class="tx">{{ tag }}</span>
        <i class="rm fa fa-remove" @click="removeTag(index)" />
      </div>
    </div>
    <div class="the-input">
      <factor-input-text v-model="addedText" placeholder="Add Tag" @keyup.enter="addTag()" />
      <factor-btn @click="addTag()">
        <i class="fa fa-plus" />
      </factor-btn>
    </div>
  </div>
</template>
<script>
export default {
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
    addedSlug() {
      return this.$utils.slugify(this.addedText)
    }
  },
  mounted() {
    this.$watch(
      "value",
      function(v) {
        if (v && !this.$lodash.isEqual(v, this.tags)) {
          this.tags = v
        }
      },
      { immediate: true, deep: true }
    )
  },
  methods: {
    addTag() {
      this.tags.push(this.addedSlug)
      this.addedText = ""
      this.$emit("input", this.tags)
    },
    removeTag(index) {
      this.tags.splice(index)
      this.$emit("input", this.tags)
    }
  }
}
</script>

<style lang="less">
.tag-input {
  .the-tags {
    margin-bottom: 1em;
  }
  .tag {
    display: inline-block;
    padding: 3px 0.5em;
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
      0 2px 5px 0 rgba(43, 45, 80, 0.08), 0 1px 1.5px 0 rgba(0, 0, 0, 0.07),
      0 1px 2px 0 rgba(0, 0, 0, 0.08);
    border-radius: 5px;
    margin: 0 0.5em 0.5em 0;
    .tx {
      margin-right: 5px;
    }
    .rm {
      font-size: 0.8em;
      opacity: 0.3;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
  .the-input {
    display: flex;

    input[type="text"] {
      background-color: #f7f9ff;
      box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15),
        0 1px 2px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;

      margin-right: 0.5em;
    }
  }
}
</style>