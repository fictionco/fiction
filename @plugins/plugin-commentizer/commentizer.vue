<template>
  <div class="commentizer">
    <commentizerDisplay :post-id="postId" />
    <commentizerAdd :post-id="postId" />
  </div>
</template>

<script>
export default {
  props: {
    postId: { type: String, required: true }
  },
}
</script>
