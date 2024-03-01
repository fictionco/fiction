<template>
  <figure
    ref="wrapper"
    class="figure-splash origin-center relative mx-auto h-96 w-132"
  >
    <div class="stage h-full">
      <div class="main h-full w-full rounded-xl overflow-hidden shadow-2xl">
        <div
          class="scroller bg-gray-800 bg-contain w-full bg-repeat-y"
          :style="{ backgroundImage: `url(${scrollerBg})` }"
        />
      </div>
      <img
        src="../img/terminal.svg"
        alt="Terminal"
        class="image1 absolute left-0 bottom-10 z-30 w-4/12 rounded-lg shadow-2xl"
      />
    </div>
  </figure>
</template>

<script lang="ts">
import scrollerBg from "../img/code-editor.svg"

export default {
  setup() {
    return { scrollerBg }
  },
}
</script>

<style lang="less">
figure.figure-splash {
  @media (min-width: 768px) {
    width: 700px;
    height: 500px;
  }

  /** 
  ** Transforms and Animations
  **/
  perspective: 1400px;

  .stage {
    perspective: 800px;
  }
  .main {
    animation: mainTransform 1s 0.25s forwards;
    .scroller {
      height: 1000%;
      animation: scrollerTransform 150s 0.25s infinite;
    }
  }
  .image1 {
    animation: image1Transform 1s 0.25s forwards;
  }

  @keyframes mainTransform {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1) perspective(500px) rotateX(1deg) rotateY(-2deg)
        rotateZ(0deg) translateZ(-35px);
    }
  }

  @keyframes scrollerTransform {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-50%);
    }
  }

  @keyframes image1Transform {
    from {
      transform: scale(0.9);
    }
    to {
      transform: perspective(1040px) rotate(-2deg) rotateX(-2deg) rotateY(11deg)
        translateZ(20px) scale(1);
    }
  }
}
</style>
