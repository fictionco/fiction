<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElLogo from './ElLogo.vue'

const wrapper = vue.ref<HTMLElement>()
const width = vue.ref<number>(500)

/**
 * Get figure width
 */
function getWidth(): number {
  return wrapper.value ? wrapper.value.clientWidth : 100
}
/**
 * Scale figure based on width
 */
const scale = vue.computed(() => {
  return Math.max(Math.min(width.value / 500, 1), 0.5)
})

vue.onMounted(() => {
  /**
   * Get figure width
   */
  width.value = getWidth()
  /**
   * Update stage width on window resize
   */
  window.addEventListener('resize', () => {
    width.value = getWidth()
  })
})

const boxClass = 'bg-theme-0 dark:bg-theme-900 dark:after:bg-theme-800 dark:before:bg-theme-800'
const lineClass = 'border-theme-0 dark:border-theme-800'
</script>

<template>
  <figure ref="wrapper" class="figure-powered lg:mr-auto font-sans">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="scene relative">
          <div class="box-0 icon-box">
            <div class="box z" :class="boxClass">
              <svg
                class="main-logo h-8"
                viewBox="0 0 488 122"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M271.21 72.2368C267.936 67.6287 262.047 65.5272 256.81 65.5272C246.07 65.5272 238.61 75.7256 238.61 86.7755C238.61 95.5797 243.974 100.751 252.098 100.751C258.234 100.572 264.156 98.3679 268.987 94.4603L270.824 111.512C264.542 116.965 253.802 119.335 246.076 119.335C229.713 119.335 217.929 107.735 217.929 90.0994C217.929 66.6192 234.591 47.6098 256.943 47.6098C263.358 47.6098 272.115 49.567 276.819 54.8757L271.21 72.2368Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M305.105 48.8953H319.452L316.611 66.0917H302.397C300.907 75.459 298.232 85.8016 298.232 95.3269C298.232 99.3787 300.128 100.629 303.781 100.629C306.004 100.635 308.206 100.21 310.282 99.3719L308.619 117.118C303.628 118.491 298.491 119.247 293.321 119.356C282.621 119.356 276.259 114.323 276.259 102.861C276.259 90.705 279.506 77.8489 281.256 66.0986L283.925 48.9022H283.965L285.316 40.2354C285.528 38.3811 285.622 36.5131 285.582 34.6452C285.595 33.2099 285.508 31.7745 285.316 30.3461H306.297C306.603 31.8501 306.736 33.3884 306.689 34.9267C306.676 37.0351 306.496 39.1434 306.15 41.2243L305.105 48.8953Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M318.767 117.797C318.355 116.204 318.175 114.556 318.228 112.908C318.235 110.889 318.414 108.876 318.767 106.892L325.941 58.9562C326.193 57.0539 326.333 55.1379 326.346 53.2218C326.36 51.7865 326.267 50.3443 326.074 48.9227H347.068C347.381 50.4405 347.52 51.9925 347.474 53.5377C347.461 55.6461 347.281 57.7475 346.935 59.8215L339.762 107.757C339.515 109.467 339.376 111.191 339.356 112.915C339.329 114.556 339.469 116.197 339.762 117.804L318.767 117.797ZM339.183 41.2036C333.493 41.2036 328.895 37.8522 328.895 31.5547C328.895 23.4441 335.117 17.7166 342.842 17.7166C348.678 17.7166 353.13 21.0679 353.13 27.3586C353.163 35.3387 346.928 41.2036 339.183 41.2036Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M378.151 119.336C361.695 119.336 348.992 109.138 348.992 90.2657C348.992 65.9477 365.827 47.6457 388.585 47.6457C405.167 47.6457 417.744 57.9676 417.744 76.8809C417.764 101.144 401.055 119.336 378.151 119.336ZM385.99 65.5219C375.449 65.5219 369.407 76.7023 369.407 87.0174C369.407 94.8395 373.266 100.711 380.846 100.711C391.386 100.711 397.428 89.5309 397.428 79.2158C397.455 71.3937 393.595 65.5219 386.016 65.5219H385.99Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M461.596 117.798C461.19 116.205 461.003 114.557 461.057 112.908C461.063 110.889 461.243 108.877 461.596 106.892L465.389 81.8807C465.808 79.6144 466.034 77.3138 466.061 74.9994C466.061 69.265 463.891 66.0578 458.069 66.0578C448.593 66.0578 445.479 75.4183 444.255 83.6731L438.971 117.777H417.85L426.814 59.2521C427.066 57.2536 427.2 55.2483 427.213 53.2361C427.226 51.8008 427.14 50.3586 426.947 48.937H447.775C448.087 50.4548 448.227 52.0068 448.181 53.5589C448.154 55.2895 448.021 57.0064 447.775 58.7164H447.908C452.785 52.0068 459.965 47.6734 468.23 47.6734C481.492 47.6734 488 54.2457 488 67.7953C487.993 70.9819 487.714 74.1616 487.168 77.2932L482.424 107.765C482.177 109.475 482.038 111.198 482.018 112.922C481.991 114.563 482.131 116.205 482.424 117.819L461.596 117.798Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M181.593 47.7951C182.718 40.9825 183.43 35.2206 191.561 34.0188C194.576 33.6617 195.707 33.5312 198.548 33.8746L202.295 15.8541C197.71 15.0506 192.852 15.1743 188.747 15.5726C168.205 17.571 162.515 29.8159 159.707 47.7814H149.06L146.911 65.6095H157.045C157.045 65.6095 151.003 100.167 150.597 102.66C150.191 105.153 147.756 118.819 147.756 118.819L169.602 118.503C169.602 118.503 169.229 118.641 170.354 111.396L178.512 65.6301H193.371L187.15 104.858C186.724 107.316 185.706 118.311 185.706 118.311L206.62 118.153C206.76 113.188 206.92 111.904 207.345 107.756C207.771 103.601 212.822 76.3298 212.822 76.3298C213.62 71.1585 214.845 63.5905 215.936 57.547C216.928 52.0461 216.375 47.8089 216.375 47.8089H181.593V47.7951Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M101.983 122H50.8045C47.484 122 44.3565 120.668 42.0075 118.237L3.01319 77.9858C0.0653321 74.9503 -0.806383 70.4109 0.783998 66.4414C2.38103 62.4651 6.1008 59.8898 10.2731 59.8898H58.0577V10.5739C58.0577 6.28166 60.5464 2.44269 64.3926 0.79448C68.1789 -0.83313 72.6906 0.0939898 75.5852 3.08138L114.599 43.3458C116.948 45.7838 118.239 49.0047 118.239 52.4248V105.229C118.233 114.48 110.946 122 101.983 122ZM52.9472 103.856H100.659V54.6155L75.6384 28.7935V78.0339H27.927L52.9472 103.856Z"
                  fill="currentColor"
                />
              </svg>

              <div class="caption" />
            </div>
          </div>
          <div class="box-1 icon-box">
            <div class="line depart" :class="lineClass" />
            <div class="line arrive" :class="lineClass" />
            <div class="box a" :class="boxClass">
              <img src="./img/figure-powered-vue.svg" alt="Vue">
              <div class="caption">
                Vue.js
              </div>
            </div>
          </div>
          <div class="box-2 icon-box">
            <div class="line depart" :class="lineClass" />
            <div class="line arrive" :class="lineClass" />
            <div class="box b" :class="boxClass">
              <img src="./img/figure-powered-nodejs.svg" alt="Node">
              <div class="caption">
                Node.js
              </div>
            </div>
          </div>
          <div class="box-3 icon-box">
            <div class="line depart" :class="lineClass" />

            <div class="box" :class="boxClass">
              <img src="./img/figure-powered-vite.svg" alt="MongoDB">
              <div class="caption">
                Vite
              </div>
            </div>
          </div>
          <div class="box-4 icon-box">
            <div class="line depart" :class="lineClass" />

            <div class="box" :class="boxClass">
              <img
                src="./img/figure-powered-typescript.svg"
                alt="Typescript"
              >
              <div class="caption">
                Typescript
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.figure-powered {
  --color-wire: #e6ebf1;
  --color-shaded: #ced2dd;
  max-width: 100%;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translateX(-60px) scale(1.4);
    @media (max-width: 900px) {
      transform: translateX(-100px) translateY(45px) scale(1.2);
    }
    .factor-stack {
      position: absolute;
      left: 85%;
      bottom: 45%;
      z-index: 100;
      transform: translateX(-46px);
    }
    perspective: 1300px;
    .scene {
      background-image: url("./img/pattern-dot.svg");
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transform: rotateX(60deg) rotateY(0deg) rotate(45deg) scale(1.2) translate(124px, -45px);
      transform-style: preserve-3d;

      .icon-box {
        position: absolute;
        transform: translateZ(1px);
        transform-style: preserve-3d;
        .box {
          transform-style: preserve-3d;
          text-align: center;
          box-shadow: 0 0 1px var(--color-wire);
          overflow: visible;
          transform: translateZ(4px);
          padding: 10px 15px;

          z-index: 5;
          img {
            max-width: 48px;
            display: inline-block;
          }
          .caption {
            display: block;
            font-size: 0.8em;
            text-align: center;
          }

          &:after {
            // background-color: var(--color-shaded);
            bottom: 0;
            content: "";
            right: 0;
            position: absolute;
            top: 0;
            width: 5px;
            z-index: -10;
            transform: translateX(40%) rotateY(-90deg) translateX(-2.5px);
          }
          &:before {
            // background-color: var(--color-wire);

            content: "";
            bottom: 0;
            left: 0;
            right: 0;
            position: absolute;
            height: 5px;
            width: 100%;
            z-index: -10;
            transform: translateY(50%) rotateX(-90deg) translateY(2.5px);
          }
        }
        .line {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 1;
          border-width: 0;
          border-style: solid;
        }

        &.box-0 {
          top: 12%;
          left: 32%;
          .box {
            padding: 12px;
          }
        }
        &.box-1 {
          bottom: 10%;
          left: 25%;
          .line.depart {
            width: 2em;
            height: 2em;
            border-left-width: 2px;
            border-top-width: 2px;
            border-top-left-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 2.5em;
            height: 4.5em;
            border-right-width: 2px;
            border-bottom-width: 2px;
            border-bottom-right-radius: 7px;
            transform: translateY(-100%) translateY(-2em) translateY(2px)
              translateX(7px);
          }
        }
        &.box-2 {
          bottom: 0%;
          left: 50%;
          .line {
            left: auto;
            right: 50%;
          }
          .line.depart {
            width: 2em;
            height: 2em;
            border-right-width: 2px;
            border-top-width: 2px;
            border-top-right-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 3em;
            height: 6em;
            border-left-width: 2px;
            border-bottom-width: 2px;
            border-bottom-left-radius: 7px;
            transform: translateY(-100%) translateY(-2em) translateY(2px)
              translateX(-7px);
          }
        }
        &.box-3 {
          bottom: 5%;
          left: 75%;
          .line {
            left: auto;
            right: 50%;
          }
          .line.depart {
            width: 12em;
            height: 8.5em;
            border-right-width: 2px;
            border-top-width: 2px;
            border-top-right-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 11em;
            height: 4em;
            border-left-width: 2px;
            border-bottom-width: 2px;
            border-bottom-left-radius: 7px;
            transform: translateY(-100%) translateY(-3em) translateY(2px)
              translateX(-7px);
          }
        }
        &.box-4 {
          bottom: 55%;
          left: 5%;
          .line {
            right: auto;
            left: 50%;
            top: 30%;
          }
          .line.depart {
            width: 8em;

            border-top-width: 2px;

            transform: translateY(-50%);
          }
        }
      }
    }
  }
}
</style>
