<template>
  <div class="wrap">
    <factor-input-wrap
      v-model="title"
      input="factor-input-text"
      label="Title"
      description="Your example title"
      placeholder="Write A Title"
      required
    />
    <factor-input-wrap
      v-model="select"
      input="factor-input-select"
      label="Select Option"
      description="Options for selecting something"
      placeholder="Select Something"
      :list="['foo', 'bar', 'baz']"
      required
    />
  </div>
</template>

<script lang="ts">
import { factorInputWrap } from "@factor/ui"

export default {
  components: { factorInputWrap },
  data() {
    return {
      title: "",
      description: "",
      select: "",
    }
  },
}
</script>


<style lang="less" scoped>
.wrap {
  align-items: center;

  display: flex;
  flex-wrap: wrap;
}
</style>
