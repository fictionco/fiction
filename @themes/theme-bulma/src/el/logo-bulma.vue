<template>
  <div class="logo-bulma">
    <factor-link path="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 40 40"
      >
        <defs>
          <linearGradient
            id="a"
            x1="37.2"
            y1="10.8"
            x2="4.4"
            y2="43.6"
            gradientTransform="matrix(1, 0, 0, -1, 0, 48)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.36" stop-color="#00c1a5"/>
            <stop offset="1" stop-color="#00bfa3"/>
          </linearGradient>
        </defs>
        <title>logo</title>
        <rect width="40" height="40" rx="3" ry="3" style="fill:url(#a)"/>
        <path
          d="M26.39,31H17.16a2.16,2.16,0,0,1-1.58-.68l-7-7.26A1.94,1.94,0,0,1,8.14,21,1.85,1.85,0,0,1,9.85,19.8h8.62V10.91a1.92,1.92,0,0,1,1.14-1.77,1.84,1.84,0,0,1,2,.42l7,7.26a2.35,2.35,0,0,1,.65,1.63V28A3,3,0,0,1,26.39,31Zm-8.84-3.27h8.6V18.85l-4.51-4.66v8.88H13Z"
          style="fill:#f7f7f7"
        />
      </svg>
    </factor-link>
  </div>
</template>
<style lang="less">
.logo-bulma {
  a {
    display: flex;
    height: 100%;
    svg {
      display: block;
      width: 40px;
    }
  }
}
</style>

