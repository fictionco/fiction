<template>
  <div class="switcher">
    <div class="brand">
      <factor-link path="/" class="logo">
        <div class="fiction-icon">
          <svg
            width="39"
            height="41"
            viewBox="0 0 39 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.307 40.5H16.5925C15.508 40.5 14.4866 40.0577 13.7194 39.2507L0.984092 25.8887C0.0213371 24.8811 -0.26336 23.3741 0.256049 22.0564C0.777632 20.7364 1.99248 19.8815 3.35512 19.8815H18.9613V3.51018C18.9613 2.0853 19.7741 0.810894 21.0303 0.263742C22.2668 -0.276572 23.7403 0.0312015 24.6857 1.02292L37.4275 14.3894C38.1947 15.1987 38.6163 16.268 38.6163 17.4033V34.9327C38.6141 38.0036 36.2344 40.5 33.307 40.5ZM17.2922 34.4768H32.8745V18.1306L24.7031 9.5585V25.9047H9.12078L17.2922 34.4768Z"
              fill="#0471ff"
            />
          </svg>
        </div>

        <div class="sub-name">Demos</div>
      </factor-link>
    </div>
    <div class="selector nav-area">
      <plugin-selector />
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { pluginSelector: () => import("./selector.vue"), factorLink },
}
</script>
<style lang="postcss">
.switcher {
  display: flex;
  padding: 0 1rem;
  width: 100%;
  box-shadow: 0 0 0 1px var(--color-border);
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;
    color: inherit;
    .sub-name {
      font-weight: 700;
      margin-left: 0.5rem;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-size: 0.8em;
    }
  }
  .fiction-icon {
    border-radius: 0.5rem;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--color-border);
    padding: 0.5rem 0.55rem 0.6rem 0.5rem;
    a {
      display: block;
    }
    svg {
      height: 1.25rem;
      width: 1.25rem;
      display: block;
    }
  }

  .nav-area {
    padding: 0.5rem;
  }
}
</style>
