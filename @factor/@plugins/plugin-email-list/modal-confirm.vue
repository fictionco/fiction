<template>
  <factor-app-modal class="added-modal" :vis.sync="vis">
    <h2 class="added-title">{{ settings.title }}</h2>
    <div class="added-text">{{ settings.text }}</div>
    <div class="actions">
      <factor-app-btn btn="primary" @click="vis = false">Close</factor-app-btn>
    </div>
  </factor-app-modal>
</template>
<script>
export default {
  props: {
    added: { type: Boolean, default: false }
  },
  data() {
    return {
      vis: false
    }
  },
  computed: {
    settings() {
      return this.$setting.get("emailList.success")
    }
  },
  watch: {
    added: function(v) {
      if (v) this.vis = v
    }
  }
}
</script>

<style lang="less">
.added-modal {
  .added-title {
    letter-spacing: -0.02em;
    font-size: 2em;
    font-weight: 700;
  }
  .added-text {
    opacity: 0.7;
  }
  .confirm-icon {
    svg {
      height: 64px;
      width: 64px;
    }
  }
  .actions {
    margin-top: 3rem;
  }
}
</style>