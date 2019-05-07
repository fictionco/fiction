<template>
  <div class="fiction-pin">
    <svg
      class="pinny"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 631.98 631.84"
    >
      <defs>
        <style/>
      </defs>
      <title>Untitled-1</title>
      <path
        class="pin-fill"
        d="M728.45,809H455.33A65.83,65.83,0,0,1,408.4,789.5L200.26,581.35A54.8,54.8,0,0,1,239,487.8H494v-255a54.62,54.62,0,0,1,33.8-50.57A55.38,55.38,0,0,1,587.54,194l208.21,208.2a66.16,66.16,0,0,1,19.42,46.94V722.24A86.81,86.81,0,0,1,728.45,809ZM466.74,715.14H721.35V460.53L587.83,327V581.62H333.22Z"
        transform="translate(-183.68 -177.61)"
      />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    fill: { type: String, default: "#ff0076" }
  }
}
</script>
<style lang="less">
.pinny {
  display: inline-block;
  width: 55px;
  padding-right: 1em;
  .pin-fill {
    fill: #ff0076;

    animation: pincolor 30s ease-in-out infinite;
  }
}
@keyframes pincolor {
  0%,
  100% {
    fill: var(--color-secondary);
  }
  50% {
    fill: var(--color-primary);
  }
}
</style>