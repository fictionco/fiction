<template>
  <div class="user-card-wrap">
    <div v-if="user" class="user-card">
      <div class="user-card-info">
        <factor-link class="the-user" path="/profile" :query="{uid}">
          <div class="img">
            <factor-avatar :url="user.photoURL" width="20px" />
          </div>
          <div class="text">
            <div class="name">{{ user.displayName }}</div>
            <div v-if="subText" class="meta">{{ subText }}</div>
          </div>
        </factor-link>
        <div class="the-meta">
          <div v-if="$listeners.remove" class="remove" @click.stop>
            <a @click.prevent.stop="$emit('remove', $event)">
              <i class="fa fa-remove" />
            </a>
          </div>
        </div>
      </div>
    </div>
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
.user-card-wrap {
  display: inline-block;

  vertical-align: top;
}
.user-card {
  text-align: left;
  line-height: 1;

  .remove {
    display: inline-block;
    margin-left: 2px;

    font-size: 0.8em;
    a {
      opacity: 0.2;
      display: inline-block;
      color: inherit;
      border-radius: 1em;
      width: 1.4em;
      line-height: 1.4em;
      text-align: center;
      &:hover {
        opacity: 0.7;
      }
    }
  }

  .user-card-info,
  .the-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .the-user {
    color: inherit;
    padding-right: 0.5em;
  }
  .img {
    margin-right: 0.5em;
  }
  .text {
    min-width: 0;
    letter-spacing: -0.03em;
  }

  .meta {
    opacity: 0.5;
    font-size: 0.85em;
  }
}
</style>
