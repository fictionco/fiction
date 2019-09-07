<template>
  <factor-app-modal class="added-modal" :vis.sync="vis">
    <h2 class="added-title">{{ $setting.get('emailList.success.title') }}</h2>
    <div class="added-text">{{ $setting.get('emailList.success.text') }}</div>
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
    font-size: 2em;
  }
  .confirm-icon {
    svg {
      height: 64px;
      width: 64px;
    }
  }
}
</style>