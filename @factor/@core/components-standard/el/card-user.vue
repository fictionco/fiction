<template>
  <div class="card-wrap">
    <factor-link v-if="user" class="card" path="/profile" :query="{uid}">
      <factor-avatar :url="user.photoURL" width="1.25em" />
      <div class="name">{{ user.displayName }}</div>
      <div v-if="$listeners.remove" class="remove" @click.prevent.stop="$emit('remove', $event)">
        <factor-icon icon="remove" />
      </div>
    </factor-link>
  </div>
</template>
<script>
export default {
  props: {
    uid: { type: String, default: "" },
    subText: { type: String, default: "" },
    remove: { type: Boolean, default: false }
  },
  data() {
    return {
      user: {}
    }
  },

  async mounted() {
    this.user = await this.$user.request(this.uid)
  }
}
</script>

<style lang="less">
.card-wrap {
  display: inline-block;
}
.card {
  color: inherit;
  &:hover {
    color: inherit;
  }
  text-align: left;
  line-height: 1;

  box-shadow: @factor-input-shadow;
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

    line-height: 1.25em;
    border-radius: 10px;
    opacity: 0.2;
    text-align: center;
    i {
      font-size: 0.7em;
    }
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
