<script lang="ts" setup></script>

<template>
  <div class="night">
    <div v-for="(s, i) in 16" :key="i" class="shooting-star" />
  </div>
</template>

<style lang="less">
.night {
  --dur: 1s;
}

@keyframes animateBg {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
.shooting-star {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  border-radius: 50%;
  animation: animate 300s linear infinite;
}
.shooting-star::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 3px;

  background: linear-gradient(90deg, #334155, transparent);
}
@keyframes animate {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1500px);
    opacity: 0;
  }
}
.shooting-star:nth-child(1) {
  top: 0;
  right: 0;
  left: initial;
  animation-delay: 0;
  animation-duration: 126s;
}

.shooting-star:nth-child(2) {
  top: 0;
  right: 80px;
  left: initial;
  animation-delay: 0.2s;
  animation-duration: 332s;
}

.shooting-star:nth-child(3) {
  top: 80px;
  right: 0px;
  left: initial;
  animation-delay: 0.6s;
  animation-duration: 96s;
}

.shooting-star:nth-child(4) {
  top: 0;
  right: 180px;
  left: initial;
  animation-delay: 1.2s;
  animation-duration: 90s;
}

.shooting-star:nth-child(5) {
  top: 0;
  right: 400px;
  left: initial;
  animation-delay: 4s;
  animation-duration: 88s;
}

.shooting-star:nth-child(6) {
  top: 0;
  right: 600px;
  left: initial;
  animation-delay: 1s;
  animation-duration: 120s;
}
.shooting-star:nth-child(7) {
  top: 300px;
  right: 0px;
  left: initial;
  animation-delay: 8s;
  animation-duration: 220s;
  transform: scale(1.3);
}

.shooting-star:nth-child(8) {
  top: 0px;
  right: 700px;
  left: initial;
  animation-delay: 3s;
  animation-duration: 45s;
}

.shooting-star:nth-child(9) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 12s;
  animation-duration: 84s;
}

.shooting-star:nth-child(10) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 12s;
  animation-duration: 98s;
}
.shooting-star:nth-child(11) {
  top: 0px;
  right: 700px;
  left: initial;
  animation-delay: 30s;
  animation-duration: 45s;
}

.shooting-star:nth-child(12) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 32s;
  animation-duration: 84s;
}

.shooting-star:nth-child(13) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 42s;
  animation-duration: 48s;
}
.shooting-star:nth-child(14) {
  top: 0px;
  right: 700px;
  left: initial;
  animation-delay: 20s;
  animation-duration: 35s;
  transform: scale(0.7);
}

.shooting-star:nth-child(15) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 32s;
  animation-duration: 84s;
  transform: scale(0.7);
}

.shooting-star:nth-child(16) {
  top: 0px;
  right: 1000px;
  left: initial;
  animation-delay: 42s;
  animation-duration: 48s;
  transform: scale(0.7);
}
</style>
