<template>
  <component :is="form" v-bind="$attrs" :list-id="listId" />
</template>
<script>
export default {
  props: {
    listId: { type: String, default: "default" }
  },
  computed: {
    form() {
      return this.$emailList.getSetting({
        key: "form.component",
        listId: this.listId
      })
    }
  }
}
</script>



