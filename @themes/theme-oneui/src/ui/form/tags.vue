<template lang="pug">
  VueSelect(v-model="tags" :options="list" taggable multiple)
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import VueSelect from "vue-select"
import { isEqual, slugify, toLabel, parseList, ListItem } from "@factor/api"

@Component({
  components: { VueSelect },
  methods: {
    toLabel,
  },
})
export default class ThemeTags extends Vue {
  @Prop({ default: () => [] }) readonly value!: any[]
  @Prop({ default: () => [] }) readonly list!: any[]
  @Prop({ default: 0 }) readonly min?: string | number
  @Prop({ default: 10 }) readonly max?: string | number

  tags: any[] = []
  addedText = ""

  get tagNumber() {
    return this.tags.length
  }
  get addedSlug() {
    return slugify(this.addedText)
  }
  get parsedList(): ListItem[] {
    return this.list ? parseList(this.list) : []
  }

  @Watch("tags", { immediate: true, deep: true })
  onTagsChanged(v: string[]) {
    if (v.length > 0 && !isEqual(v, this.tags)) {
      this.$emit("input", this.tags)
    }
  }

  public getListItemName(value: string) {
    const item = this.parsedList.find((_: ListItem) => _.value == value)
    return item ? item.name : toLabel(value)
  }
}
</script>

<style lang="scss">
@import "~vue-select/src/scss/vue-select";
@import "../../assets/scss/vendor/vue-select";
</style>
