<template>
  <div class="commentizer">
    <commentizerDisplay :post-id="postId" />
    <commentizerAdd :post-id="postId" />
  </div>
</template>

<script>
export default {
  components: {
    commentizerDisplay: () => import("./commentizer-display.vue"),
    commentizerAdd: () => import("./commentizer-add.vue")
  },
  props: {
    postId: { type: String, required: true }
  }
}
</script>
