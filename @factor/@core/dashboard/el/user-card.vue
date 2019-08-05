<template>
  <div class="card-user card-wrap">
    <dashboard-link v-if="postSet" class="card" path="/profile" :query="{_id: user._id}">
      <div class="name">{{ user.displayName }}</div>
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
    postSet() {
      return this.$lodash.isEmpty(this.user) ? false : true
    },
    user() {
      return this.$store.val(this.postId) || {}
    }
  }
}
</script>

<style lang="less">
.card-user {
  display: inline-block;
  .card {
    box-shadow: var(--input-shadow);
    border-radius: 5px;
    color: inherit;
    &:hover {
      color: inherit;
    }
    text-align: left;
    line-height: 1;

    display: flex;
    align-items: center;
    .name {
      padding: 0 10px 0 10px;
      font-size: 0.9em;
    }

    padding: 2px;
    .remove {
      width: 1.25em;
      height: 1.25em;

      border-radius: 10px;
      opacity: 0.2;
      text-align: center;
      margin-left: -5px;
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
