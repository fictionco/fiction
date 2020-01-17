<template>
  <div class="card-user card-wrap">
    <div v-if="postSet" class="card">
      <div class="name">{{ user.displayName || user.email }}</div>
      <div v-if="$listeners.remove" class="remove" @click.prevent.stop="$emit('remove', $event)">
        <factor-icon icon="fas fa-remove" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorIcon } from "@factor/ui"
import { isEmpty, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon },
  props: {
    postId: { type: String, default: "" },
    subText: { type: String, default: "" },
    remove: { type: Boolean, default: false }
  },
  computed: {
    postSet() {
      return isEmpty(this.user) ? false : true
    },
    user() {
      return stored(this.postId) || {}
    }
  }
})
</script>

<style lang="less">
.card-user {
  display: inline-block;
  .card {
    box-shadow: var(--box-shadow-input);
    border-radius: 5px;
    color: inherit;
    &:hover {
      color: inherit;
    }
    text-align: left;

    display: flex;
    align-items: center;
    .name {
      padding: 0 10px 0 10px;
      font-size: 0.85em;
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
