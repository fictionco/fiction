<template>
  <div class="card-user card-wrap">
    <dashboard-link v-if="post" class="card" path="/profile" :query="{_id: post._id}">
      <factor-avatar :url="post.avatar.url" width="1.25em" />
      <div class="name">{{ post.displayName }}</div>
      <div v-if="$listeners.remove" class="remove" @click.prevent.stop="$emit('remove', $event)">
        <factor-icon icon="remove" />
      </div>
    </dashboard-link>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" },
    subText: { type: String, default: "" },
    remove: { type: Boolean, default: false }
  },
  computed: {
    post() {
      return this.$store.getters["getItem"](this.postId) || {}
    },
    avatar() {
      const { avatar: { url = "" } = {} } = this.post
      return url
    }
  }
}
</script>

<style lang="less">
.card-user {
  display: inline-block;
  .card {
    color: inherit;
    &:hover {
      color: inherit;
    }
    text-align: left;
    line-height: 1;

    //box-shadow: @factor-input-shadow;
    display: flex;
    align-items: center;
    .name {
      padding: 0 5px;
      font-size: 0.9em;
    }
    border-radius: 1.25em;
    padding: 2px;
    .remove {
      width: 1.25em;
      height: 1.25em;

      border-radius: 10px;
      opacity: 0.2;
      text-align: center;
      i {
        font-size: 0.85em;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
